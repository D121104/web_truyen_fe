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
  IChapter,
  ICategory,
  IReadingHistory,
  ViewHistoryDto,
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
export const createBook = async (
  body: IBook,
  groupId: string
): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/books?groupId=${groupId}`,
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

export const deleteBook = async (id: string): Promise<any> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/books/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const updateBook = async (body: IBook): Promise<any> => {
  // Loại bỏ các thuộc tính không cần thiết
  const { createdAt, updatedAt, ...filteredBody } = body;

  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/books`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredBody), // Gửi dữ liệu đã được lọc
  });

  return res;
};

export const getBooks = async ({
  current = 1,
  pageSize = 10,
  title = "",
  limit = "",
  sort = "",
  bookTitle = "",
  categoryId = "",
  status = "",
  period = "",
}): Promise<IBackendRes<IModelPaginate<IBook>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/books?current=${current}&pageSize=${pageSize}${
      title ? `&title=${encodeURIComponent(title)}` : ""
    }${limit ? `&limit=${limit}` : ""}${sort ? `&sort=${sort}` : ""}${
      categoryId ? `&categoryId=${categoryId}` : ""
    }${status ? `&status=${status}` : ""}${
      period && period !== "all" ? `&period=${period}` : ""
    }${bookTitle ? `&bookTitle=${new RegExp(bookTitle, "i")}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const getBookById = async (
  bookId: string = "",
  limit = "",
  sort = ""
): Promise<IBackendRes<IBook>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/books/${bookId}${limit ? `?limit=${limit}` : ""}${
      sort ? `&sort=${sort}` : ""
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

export const getBooksSortedByViews = async (
  limit: number = 10
): Promise<IBook[]> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/books/top?period=all&limit=${limit}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // Nếu backend trả về mảng truyện đã sắp xếp theo views
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
  groupStatus = "",
}): Promise<IBackendRes<IModelPaginate<ITranslatorGroup>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups?current=${current}&pageSize=${pageSize}${
      groupStatus ? `&groupStatus=${groupStatus}` : ""
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

export const updateGroup = async (body: ITranslatorGroup): Promise<any> => {
  // Loại bỏ các thuộc tính không cần thiết
  const { createdAt, updatedAt, ...filteredBody } = body;

  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredBody),
    }
  );
  return res;
};

export const getGroupById = async (
  id: string
): Promise<IBackendRes<ITranslatorGroup>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/translator.groups/group/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
  // Loại bỏ các thuộc tính không cần thiết
  const { createdAt, updatedAt, ...filteredBody } = body;

  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredBody),
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

export const updateUserPassword = async (
  userId: string,
  values: { password: string }
): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/users/change-password/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );
  return res;
};

export const unfollowBook = async (
  userId: string,
  bookId: string
): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/users/unfollow-book/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId }),
    }
  );
  return res;
};

export const followBook = async (
  userId: string,
  bookId: string
): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/users/follow-book/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId }),
    }
  );
  return res;
};

export const getBooksByIds = async (ids: string[]) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/books/many`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  return res;
};

export const fetchBooksByCategory = async (
  current: number,
  pageSize: number,
  categoryId?: string,
  status?: string,
  period?: string
): Promise<IBackendRes<IModelPaginate<IBook>>> => {
  // Xây dựng query string
  let query = `current=${current}&pageSize=${pageSize}`;
  if (categoryId) query += `&categoryId=${categoryId}`;
  if (status && status !== "all") query += `&status=${status}`;
  if (period && period !== "all") query += `&period=${period}`;

  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/books?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

// api chapters
export const createChapter = async (
  body: IChapter & { viewsHistory?: ViewHistoryDto[] },
  bookId?: string
): Promise<any> => {
  const url = bookId
    ? `${BACKEND_URL}/api/chapters?bookId=${bookId}`
    : `${BACKEND_URL}/api/chapters`;
  const res = await fetchWithInterceptor(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

export const updateChapter = async (
  body: Partial<IChapter> & { viewsHistory?: ViewHistoryDto[] }
): Promise<any> => {
  const { createdAt, updatedAt, ...filteredBody } = body;
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/chapters`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredBody),
  });
  return res;
};

export const getChapterById = async (
  chapterId: string
): Promise<IBackendRes<IChapter>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/chapters/${chapterId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const getChapters = async ({
  current = 1,
  pageSize = 10,
}): Promise<IBackendRes<IModelPaginate<IChapter>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/chapters?current=${current}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const deleteChapter = async (
  id: string,
  bookId: string
): Promise<any> => {
  const url = bookId
    ? `${BACKEND_URL}/api/chapters/${id}?bookId=${bookId}`
    : `${BACKEND_URL}/api/chapters/${id}`;
  const res = await fetchWithInterceptor(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const getChaptersDetails = async (
  chapterIds: string[]
): Promise<IChapter[]> => {
  try {
    console.log("chapterIds", chapterIds);
    const chapters = await Promise.all(
      chapterIds.map(async (id) => {
        const res = await fetchWithInterceptor(
          `${BACKEND_URL}/api/chapters/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("res", res);

        if (!res.ok) {
          const errorData = await res;
          throw new Error(
            errorData.message || `Không thể lấy thông tin chương với ID: ${id}`
          );
        }
        console.log("res", res);
        return res;
      })
    );
    console.log("chapters", chapters);
    return chapters;
  } catch (error: any) {
    console.error("Lỗi khi gọi API getChaptersDetails:", error.message);
    throw new Error(error.message || "Đã xảy ra lỗi không xác định");
  }
};

//api categories
// Lấy danh sách thể loại (có phân trang và tìm kiếm theo tên)
export const getCategories = async ({
  current = 1,
  pageSize = 10,
  categoryName = "",
}): Promise<IBackendRes<IModelPaginate<ICategory>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/categories?current=${current}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

// Tạo mới thể loại
export const createCategory = async (body: ICategory): Promise<any> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

// Cập nhật thể loại
export const updateCategory = async (body: ICategory): Promise<any> => {
  // Loại bỏ các thuộc tính không cần thiết
  const { createdAt, updatedAt, ...filteredBody } = body;

  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/categories`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredBody),
  });
  return res;
};

// Xóa thể loại
export const deleteCategory = async (id: string): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/categories/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

//api reading history
export const saveReadingHistory = async (
  userId: string,
  bookId: string,
  chapterId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetchWithInterceptor(
      `${BACKEND_URL}/api/reading-history`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bookId,
          chapterId,
          time: Date.now(),
        }),
      }
    );
    if (res?.success === false || res?.code === 400) {
      return {
        success: false,
        message: res?.message || "Lưu lịch sử thất bại",
      };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.message || "Lỗi kết nối server" };
  }
};

export const getReadingHistory = async (
  userId: string,
  limit: number = 20
): Promise<any> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/reading-history?userId=${userId}&limit=${limit}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  // Nếu backend trả về mảng lịch sử đọc
  return res;
};

export const deleteReadingHistory = async (
  userId: string,
  bookId: string
): Promise<any> => {
  try {
    const res = await fetchWithInterceptor(
      `${BACKEND_URL}/api/reading-history/${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
        }),
      }
    );
    if (res?.data?.success === false || res?.code === 400) {
      return {
        success: false,
        message: res?.message || "Xóa lịch sử thất bại",
      };
    }
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Lỗi kết nối server" };
  }
};
