import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchAccount } from "@/config/api";
import { IBook, IChapter } from "@/types/backend";

export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async () => {
    const response = await callFetchAccount();
    console.log("response", response);
    return response?.data;
  }
);

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    coin: number;
    avatar: string;
    books?: IBook[];
    chapters?: IChapter[];
  };
  pageTitle: string;
  activeMenu: string;
  openAddBook: boolean;
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  user: {
    _id: "",
    email: "",
    name: "",
    role: "",
    coin: 0,
    avatar: "",
    books: [],
    chapters: [],
  },
  pageTitle: "Truyện mới cập nhật",

  activeMenu: "home",
  openAddBook: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,

  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user._id = action?.payload?._id;
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      state.user.role = action?.payload?.role;
      state.user.coin = action?.payload?.coin;
      state.user.avatar = action?.payload?.avatar;
      state.user.books = action?.payload?.books;
      state.user.chapters = action?.payload?.chapters;
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      localStorage.removeItem("userId");
      state.user = {
        _id: "",
        email: "",
        name: "",
        role: "",
        coin: 0,
        avatar: "",
        books: [],
        chapters: [],
      };
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload; // Cập nhật pageTitle
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.isAuthenticated = true;

        state.user._id = action?.payload?.user?._id;
        state.user.email = action.payload.user?.email;
        state.user.name = action.payload.user?.name;
        state.user.role = action?.payload?.user?.role;
        state.user.coin = action?.payload?.user?.coin;
        state.user.avatar = action?.payload?.user?.avatar;
        state.user.books =
          action?.payload?.user?.books ?? action?.payload?.books ?? [];
        state.user.chapters =
          action?.payload?.user?.chapters ?? action?.payload?.chapters ?? [];
      }
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.isAuthenticated = false;
      }
    });
  },
});

export const {
  setActiveMenu,
  setUserLoginInfo,
  setLogoutAction,
  setRefreshTokenAction,
  setPageTitle,
} = accountSlice.actions;

export default accountSlice.reducer;
