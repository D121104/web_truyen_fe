import { setRefreshTokenAction } from "@/lib/redux/slice/auth.slice";
import { makeStore } from "@/lib/redux/store";
import {
  IUser,
  ILoginUser,
  IBackendRes,
  IGetLoginUser,
  IModelPaginate,
  INotification,
  IAccount,
  IComment,
  ICreateComment,
  IBook,
  ITranslatorGroup,
} from "@/types/backend";
import { notification, message } from "antd";

const BACKEND_URL = "http://localhost:8080";

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

export const callLogin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<IBackendRes<IAccount>> => {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
    credentials: "include",
  });

  return await res.json();
};

export const callRegister = async (body: IUser) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export const callFetchAccount = async (
  accessToken = ""
): Promise<IBackendRes<IGetLoginUser> | undefined> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/auth/profile`, {
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
  if (res.code === 400) {
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

// api comments

export const getComments = async ({
  current = 1,
  bookId = "",
  pageSize = 30,
  sort = "-createdAt",
}): Promise<IBackendRes<IModelPaginate<IComment>>> => {
  const res = await fetch(
    `${BACKEND_URL}/api/comments/by-book/${bookId}?current=${current}&pageSize=${pageSize}&sort=${sort}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  return data;
};

export const createComment = async (body: ICreateComment) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

export const getCommentsByParent = async ({
  current = 1,
  pageSize = 1,
  parentId = "",
  sort = "-createdAt",
}): Promise<IBackendRes<IModelPaginate<IComment>>> => {
  const res = await fetch(
    `${BACKEND_URL}/api/comments/parent/${parentId}?current=${current}&pageSize=${pageSize}&sort=${sort}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  return data;
};

export const deleteComment = async (id: string) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/comments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

// api otps

export const createOtp = async (email: string): Promise<Response> => {
  const res = await fetch(`${BACKEND_URL}/api/otps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return res;
};

// api books
export const createBook = async (body: IBook): Promise<any> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

// api groups

export const createGroup = async (body: ITranslatorGroup): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return res;
};

export const getGroups = async ({
  current = 1,
  pageSize = 10,
}): Promise<IBackendRes<IModelPaginate<ITranslatorGroup>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups?current=${current}&pageSize=${pageSize}&groupStatus=inactive`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const updateGroup = async (body: ITranslatorGroup): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return res;
};

export const getGroupsByUser = async ({
  current = 1,
  pageSize = 10,
}): Promise<IBackendRes<IModelPaginate<ITranslatorGroup>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups/groups/by-user?current=${current}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

//api users

export const getUsers = async ({
  current = 1,
  pageSize = 10,
  name = "",
}): Promise<IBackendRes<IModelPaginate<IUser>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/users?current=${current}&pageSize=${pageSize}${
      name ? `&name=${new RegExp(name, "i")}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const createUser = async (body: IUser): Promise<any> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

export const updateUser = async (body: IUser): Promise<any> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

export const deleteUser = async (id: string): Promise<any> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};
