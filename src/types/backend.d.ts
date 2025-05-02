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
  };
}

export interface IGetLoginUser extends Omit<ILoginUser, "access_token"> {}

export interface IBook {
  _id?: string;
  book_title: string;
  description?: string;
  img_url?: string;
  view: number;
  author?: string;
  status: string;
  categories: Category[];
  chapters?: Chapter[];
  users?: User[];
}

export interface ICategory {
  _id?: string;
  name: string;
  books?: string[];
}

export interface IBuyHistory {
  _id?: string;
  note: string;
  books: string;
  users: string[];
}

export interface IChapter {
  _id?: string;
  chapteTitle: string;
  price: number;
  status: string;
  book: string;
  images: string[];
}

export interface ITranslatorGroup {
  _id?: string;
  groupName: string;
  groupDescription: string;
  groupImgUrl: string;
  groupStatus: string;
  users: string[];
  books: string[];
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
