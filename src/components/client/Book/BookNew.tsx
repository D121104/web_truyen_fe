"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Pagination } from "antd";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  getBooks,
  getBooksByIds,
  getBooksFromReadingHistory,
  getReadingHistory,
} from "@/config/api";
import { IBook, IReadingHistory } from "@/types/backend";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import styles from "@/styles/BookNew.module.scss";
import classNames from "classnames/bind";
import { usePathname, useSearchParams } from "next/navigation";
import {
  EyeFilled,
  HeartFilled,
  MessageFilled,
  StarFilled,
} from "@ant-design/icons";

import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpin from "@/components/client/Spin/LoadingSpin";
dayjs.extend(relativeTime);

const cx = classNames.bind(styles);

const BookNewContent: React.FC = () => {
  const pageTitle = useAppSelector((state) => state.auth.pageTitle);
  const pathname = usePathname();
  const userBookIds = useAppSelector((state) => state.auth.user.books) || [];
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "";
  const period = searchParams.get("period") || "";
  const user_id = useAppSelector((state) => state.auth.user._id);

  const [readingHistory, setReadingHistory] = useState<IReadingHistory[]>([]);

  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  }>({
    current: 1,
    pageSize: 36,
    total: 0,
    pages: 0,
  });

  const fetchBooks = async (current = 1, pageSize = 36, title = "") => {
    setLoading(true);
    try {
      const res = await getBooks({
        current,
        pageSize,
        title,
        sort: "-updatedAt",
      });

      if (res.code === 200) {
        setBooks(res.data?.result as IBook[]);
        setPagination(
          res.data?.meta ?? { current: 1, pageSize: 10, total: 0, pages: 0 }
        );
      } else {
        toast.error(res.message || "Không thể tải danh sách truyện");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooksByIds(userBookIds as any);
      setBooks(res.data?.result as IBook[]);
      setPagination(
        res.data?.meta ?? { current: 1, pageSize: 10, total: 0, pages: 0 }
      );
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách theo dõi:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchReadingHistory = async () => {
    try {
      setLoading(true);
      const res = await getReadingHistory(user_id);
      if (res.code === 200) {
        const history = res.data;
        setReadingHistory(history);
      } else {
        console.error("Lỗi khi lấy lịch sử đọc truyện");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đọc truyện", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByCategory = async (
    current = 1,
    pageSize = 36,
    categoryId: string,
    status: string,
    period: string
  ) => {
    setLoading(true);
    try {
      const res = await getBooks({
        current,
        pageSize,
        categoryId,
        status,
        period,
      });
      if (res.code === 200) {
        setBooks(res.data?.result as IBook[]);
        setPagination(
          res.data?.meta ?? { current: 1, pageSize: 10, total: 0, pages: 0 }
        );
      } else {
        toast.error(res.message || "Không thể tải danh sách truyện");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksFromHistory = async () => {
    setLoading(true);
    try {
      const res = await getBooksFromReadingHistory(user_id);
      if (res.code === 201) {
        setBooks((res.data?.result as IBook[]) || res.data || []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.result?.length || res.data?.length || 0,
          pages: 1,
        }));
      } else {
        toast.error(res.message || "Không thể tải danh sách truyện từ lịch sử");
      }
    } catch (error) {
      console.error("Lỗi khi tải sách từ lịch sử đọc:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname === "/") {
      fetchBooks(pagination.current, pagination.pageSize);
    } else if (pathname === "/follow") {
      fetchUserBooks();
    } else if (pathname === "/history") {
      fetchBooksFromHistory();
    } else if (pathname.startsWith("/search")) {
      fetchBooksByCategory(
        pagination.current,
        pagination.pageSize,
        categoryId,
        status,
        period
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pathname,
    pagination.current,
    pagination.pageSize,
    userBookIds,
    categoryId,
    status,
    period,
  ]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
    fetchBooks(page, pagination.pageSize);
  };

  if (loading) {
    return <LoadingSpin></LoadingSpin>;
  }
  return (
    <div className={styles.bookContainer}>
      <section className={cx("section")}>
        <div className={cx("sectionHeader")}>
          <StarFilled style={{ marginLeft: "30px", color: "#f0f0f0" }} />
          <h2>{pageTitle}</h2>
        </div>
      </section>
      <div className={styles.bookGrid}>
        {Array.isArray(books) &&
          books.length > 0 &&
          books.map((book) => (
            <div key={book._id} className={styles.bookCard}>
              <Link
                href={`/book/${book._id}?limit=all`}
                style={{ textDecoration: "none" }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={book.imgUrl}
                    alt={book.bookTitle}
                    className={styles.bookImage}
                  />
                  <div className={styles.overlay}>
                    <span>
                      <EyeFilled /> {book.totalViews ?? 0}
                    </span>
                    <span>
                      <HeartFilled /> {book.users?.length ?? 0}
                    </span>
                    <span>
                      <MessageFilled /> {book.comments?.length ?? 0}
                    </span>
                  </div>
                </div>
              </Link>

              <div className={styles.bookInfo}>
                <Link
                  href={`/book/${book._id}?limit=all`}
                  style={{ textDecoration: "none", color: "#1d1d1d" }}
                >
                  <h3 className={styles.bookTitle}>{book.bookTitle}</h3>
                </Link>

                <div className={styles.bookChapters}>
                  {Array.isArray(book.chapters) &&
                    book.chapters.length > 0 &&
                    book.chapters.map((chapter) => (
                      <Link
                        key={chapter._id}
                        href={`/book/${book._id}/chapter/${chapter._id}`}
                        style={{ textDecoration: "none", color: "#1d1d1d" }}
                      >
                        <div className={styles.chapter}>
                          <p>Chapter {chapter.chapterNumber} </p>
                          <p>
                            {" "}
                            {dayjs().diff(dayjs(chapter.createdAt), "day") > 7
                              ? dayjs(chapter.createdAt).format("DD/MM/YYYY")
                              : dayjs(chapter.createdAt).fromNow()}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div
        style={{ display: "flex", marginTop: "20px", justifyContent: "center" }}
      >
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showTotal={(total) => `Tổng ${total} truyện`}
          showQuickJumper
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

const BookNew: React.FC = (props) => (
  <Suspense>
    <BookNewContent {...props} />
  </Suspense>
);

export default BookNew;
