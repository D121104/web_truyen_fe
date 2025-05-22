"use client";

import React from "react";
import Link from "next/link";
import styles from "@/styles/BookSidebar.module.scss";
import classNames from "classnames/bind";
import { BookOutlined, ClockCircleFilled } from "@ant-design/icons";
import { useAppSelector } from "@/lib/redux/hooks";
import { IBook } from "@/types/backend";
import { getBooksByIds } from "@/config/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

const cx = classNames.bind(styles);

const BookSidebar: React.FC = () => {
  const bookIds = useAppSelector((state) => state.auth.user.books);
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  console.log("bookIds", bookIds);

  const fetchBooks = async () => {
    if (bookIds && bookIds.length > 0) {
      try {
        setLoading(true);
        const res = await getBooksByIds(bookIds as any);
        if (res.code === 201) {
          const bookData = res.data.result.map((book: IBook) => ({
            ...book,
            // continueReading: book.chapter !== book.newChapter,
          }));
          setBooks(bookData);
        } else {
          console.error("Error fetching books:", res.message);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [bookIds]);
  if (loading) {
    return <Skeleton active />;
  }
  return (
    <div className={cx("sidebar")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>
          <BookOutlined style={{ marginRight: "5px" }} />
          Truyện đang theo dõi
        </h2>
        <Link href="/follow" className={cx("view-all")}>
          Xem tất cả
        </Link>
      </div>

      <div className={cx("book-list")}>
        {books.length > 0 &&
          books.map((book) => (
            <React.Fragment key={book._id}>
              <div className={cx("book-item")}>
                <Link href={`/book/${book._id}`}>
                  {" "}
                  <img
                    src={book.imgUrl}
                    alt={book.bookTitle}
                    className={cx("book-cover")}
                  />
                </Link>

                <div className={cx("book-info")}>
                  <Link
                    href={`/book/${book._id}`}
                    className={cx("book-title")}
                    style={{
                      textDecoration: "none",
                      color: "#2c3e50",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {book.bookTitle}
                  </Link>
                  <div className={cx("chapter-info")}>
                    <Link
                      href={`/book/${book._id}/chapter/${book.chapters[0]?._id}`}
                      className={cx("book-chapter")}
                      style={{
                        textDecoration: "none",
                        color: "#1d1d1d",
                        fontSize: "13px",
                      }}
                    >
                      Chapter {book.chapters[0]?.chapterNumber}
                    </Link>
                    <span className={cx("book-time")}>
                      <span className={cx("time-icon")}>
                        <ClockCircleFilled />
                      </span>
                      {dayjs().diff(dayjs(book.chapters[0]?.updatedAt), "day") >
                      7
                        ? dayjs(book.chapters[0]?.updatedAt).format(
                            "DD/MM/YYYY"
                          )
                        : dayjs(book.chapters[0]?.updatedAt).fromNow()}
                    </span>
                  </div>
                  {/* {book.continueReading && (
                  <div className={cx("continue-reading")}>
                    <Link href={`/book/${book.id}/chapter/${book.newChapter}`}>
                      Đọc tiếp Chapter {book.newChapter}
                    </Link>
                  </div>
                )} */}
                </div>
              </div>
              <hr className={cx("divider")} />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default BookSidebar;
