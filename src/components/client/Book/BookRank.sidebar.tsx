"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/BookRankSidebar.module.scss";
import classNames from "classnames/bind";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Skeleton } from "antd";
import { IBook } from "@/types/backend";
import { getBooks } from "@/config/api";

const cx = classNames.bind(styles);

const BookRankSidebar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<IBook[]>([]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getBooks({});
      if (res.code === 200) {
        setBooks(res.data?.result as IBook[]);
      } else {
        console.error("Error fetching books:");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [setBooks]);

  if (loading) {
    return <Skeleton active />;
  }
  return (
    <div className={cx("sidebar")}>
      <div className={cx("header")}>
        <Button
          type="primary"
          href=""
          style={{ gap: "5px", width: "30%", backgroundColor: "#45a29e" }}
        >
          Top tháng
        </Button>
        <Button type="primary" href="" style={{ gap: "5px", width: "30%" }}>
          Top tuần
        </Button>
        <Button type="primary" href="" style={{ gap: "5px", width: "30%" }}>
          Top ngày
        </Button>
      </div>

      <div className={cx("book-list")}>
        {books.map((book, index) => (
          <React.Fragment key={book._id}>
            <div className={cx("book-item")}>
              <div className={cx("book-rank")}>
                {index + 1 < 10 ? "0" + (index + 1).toString() : index + 1}{" "}
              </div>

              <Link href={`/book/${book._id}?limit=all`}>
                {" "}
                <img
                  src={book.imgUrl}
                  alt={book.bookTitle}
                  className={cx("book-cover")}
                />
              </Link>
              <div className={cx("book-info")}>
                <Link
                  href={`/book/${book._id}?limit=all`}
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
                  <div className={cx("book-view")}>
                    <EyeOutlined />
                    {book.totalViews}
                  </div>
                </div>
              </div>
            </div>
            <hr className={cx("divider")} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookRankSidebar;
