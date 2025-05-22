export interface IBackendRes<T> {
  code: number | string;
  message?: string;
  error?: string;
  data?: T;
}

export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IAccount {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  coin?: number;
  isActive?: boolean;
  accountType?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  books?: string[];
  chapters?: string[];
}

export interface ILoginUser {
  access_token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    coin: number;
    avatar: string;
    books?: IBook[];
    chapters?: IChapter[];
  };
}

export interface IGetLoginUser extends Omit<ILoginUser, "access_token"> {}

export interface IBook {
  _id?: string;
  bookTitle: string;
  description?: string;
  imgUrl: string;
  totalViews?: number;
  author?: string;
  status: string;
  categories: ICategory[];
  translatorGroup?: ITranslatorGroup;
  chapters: IChapter[];
  users?: IUser[];
  comments?: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IComment {
  _id?: string;
  content: string;
  book: string;
  user: {
    _id: string;
    name: string;
  };
  parentId?: string;
  left: number;
  right: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateComment {
  content: string;
  parentId?: string;
  bookId: string;
}

export interface ICategory {
  _id?: string;
  categoryName: string;
  description?: string;
  books?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IBuyHistory {
  _id?: string;
  note: string;
  books: string;
  users: string[];
}

export interface IChapter {
  _id: string;
  chapterNumber: string;
  chapterTitle: string;
  price: number;
  status: string;
  book: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  users?: string[];
  viewsHistory?: {
    date: Date;
    views: number;
  }[];
}

export interface ViewHistoryDto {
  date: string | Date;
  views: number;
}

export interface ITranslatorGroup {
  _id?: string;
  groupName?: string;
  groupDescription?: string;
  groupImgUrl?: string;
  groupStatus?: string;
  users?: string[];
  books?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IBookChapter {
  _id?: string;
  book: IBook;
  chapters: IChapter[];
}

export interface INotification {
  _id?: string;
  senderId?: string;
  type: string;
  content: string;
  receiverId: string;
  options: {
    bookId?: string;
  };
  isActive?: boolean;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReadingHistory {
  _id?: string;
  userId: string;
  bookId: string;
  chapterId: string;
  time: number;
  createdAt?: string;
  updatedAt?: string;
  chapterNumber?: string;
  bookTitle?: string;
  bookImg?: string;
}
