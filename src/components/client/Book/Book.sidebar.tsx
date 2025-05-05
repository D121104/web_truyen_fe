"use client";

import React from "react";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import styles from "@/styles/BookSidebar.module.scss";
import classNames from "classnames/bind";
import { BookOutlined, ClockCircleFilled } from "@ant-design/icons";

const cx = classNames.bind(styles);

const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(2),
    chapter: faker.number.int({ min: 1, max: 1000 }),
    time: `${faker.number.int({ min: 1, max: 24 })} giờ trước`,
    cover: faker.image.url({ width: 160, height: 200 }),
    continueReading: faker.datatype.boolean(),
    newChapter: faker.number.int({ min: 500, max: 600 }),
  }));
};

const books = generateFakeBooks(5);

const BookSidebar: React.FC = () => {
  return (
    <div className={cx("sidebar")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>
          <BookOutlined style={{ marginRight: "5px" }} />
          Truyện đang theo dõi
        </h2>
        <Link href="/" className={cx("view-all")}>
          Xem tất cả
        </Link>
      </div>

      <div className={cx("book-list")}>
        {books.map((book) => (
          <React.Fragment key={book.id}>
            <div className={cx("book-item")}>
              <Link href="/`books/${book.id}`}>">
                {" "}
                <img
                  src={book.cover}
                  alt={book.title}
                  className={cx("book-cover")}
                />
              </Link>

              <div className={cx("book-info")}>
                <Link
                  href={`/books/${book.id}`}
                  className={cx("book-title")}
                  style={{
                    textDecoration: "none",
                    color: "#2c3e50",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {book.title}
                </Link>
                <div className={cx("chapter-info")}>
                  <Link
                    href={`/books/${book.id}/chapter/${book.chapter}`}
                    className={cx("book-chapter")}
                    style={{
                      textDecoration: "none",
                      color: "#1d1d1d",
                      fontSize: "13px",
                    }}
                  >
                    Chapter {book.chapter}
                  </Link>
                  <span className={cx("book-time")}>
                    <span className={cx("time-icon")}>
                      <ClockCircleFilled />
                    </span>
                    {book.time}
                  </span>
                </div>
                {book.continueReading && (
                  <div className={cx("continue-reading")}>
                    <Link href={`/books/${book.id}/chapter/${book.newChapter}`}>
                      Đọc tiếp Chapter {book.newChapter}
                    </Link>
                  </div>
                )}
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
