import { setRefreshTokenAction } from "@/lib/redux/slice/auth.slice";
import { makeStore } from "@/lib/redux/store";
import {
  User,
  ILoginUser,
  IBackendRes,
  IGetLoginUser,
  IModelPaginate,
  INotification,
} from "@/types/backend";
import { notification, message } from "antd";

const BACKEND_URL = "http://localhost:8080";

interface LoginPayload {
  email: string;
  password: string;
}

interface FetchOptions extends RequestInit {
  headers: {
    [key: string]: string;
  };
}

const NO_RETRY_HEADER = "No-Retry";

const fetchWithInterceptor = async (
  url: string,
  options: FetchOptions = {
    headers: {},
  }
) => {
  // Pre-request interceptor
  if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
    options.headers = {
      ...options.headers,
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    };
  }
  if (!options.headers?.Accept && options.headers?.["Content-Type"]) {
    options.headers = {
      ...options.headers,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  let response = await fetch(url, options);

  // Post-response interceptor
  if (!response.ok) {
    if (
      response.status === 401 &&
      url !== "/api/auth/login" &&
      !options.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await refreshToken();
      options.headers[NO_RETRY_HEADER] = "true";
      if (access_token) {
        options.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        response = await fetch(url, options);
      }
    }

    if (
      response.status === 400 &&
      url === "/api/auth/refresh" &&
      location.pathname.startsWith("/admin")
    ) {
      const message =
        (await response.json())?.message ?? "Có lỗi xảy ra, vui lòng login.";
      //dispatch redux action
      makeStore().dispatch(setRefreshTokenAction({ status: true, message }));
    }
    if (!response.ok) {
      const res = await response.json();
      return res;
    }
  }

  return response.json();
};

// Auth API
export async function loginUser(
  payload: LoginPayload
): Promise<IBackendRes<ILoginUser> | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: await res.json().then((data) => data.message),
      });
      return;
    }

    const data: ILoginUser = await res.json();
    return {
      statusCode: res.status,
      message: "Đăng nhập thành công",
      data: data,
    };
  } catch (error) {
    throw error.message;
  }
}

export const callFetchAccount = async (
  accessToken = ""
): Promise<IBackendRes<IGetLoginUser> | undefined> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/auth/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        localStorage.getItem("access_token") ?? accessToken
      }`,
    },
  });
  if (!res) {
    return Promise.resolve(undefined);
  }

  return res;
};

export const refreshToken = async (): Promise<string | null> => {
  const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    return null;
  }
  const data: IBackendRes<ILoginUser> = await res.json();
  return data.data?.access_token || null;
};

export const logout = async (): Promise<void> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    credentials: "include",
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

// api notifications

export const fetchNotifications = async ({
  current = 1,
  pageSize = 50,
}): Promise<IBackendRes<IModelPaginate<INotification>>> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current,
      pageSize,
    }),
  });
  return res;
};
