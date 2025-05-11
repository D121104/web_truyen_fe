"use client";

import React from "react";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import styles from "@/styles/BookHistory.module.scss";
import classNames from "classnames/bind";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

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

const books = generateFakeBooks(3);

const BookSidebar: React.FC = () => {
  return (
    <div className={cx("sidebar")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>
          <ClockCircleOutlined style={{ marginRight: "5px" }} />
          Lịch sử
        </h2>
        <Link href="/" className={cx("view-all")}>
          Xem tất cả
        </Link>
      </div>

      <div className={cx("book-list")}>
        {books.map((book) => (
          <React.Fragment key={book.id}>
            <div className={cx("book-item")}>
              <Link href={`/book/${book.id}`}>
                {" "}
                <img
                  src={book.cover}
                  alt={book.title}
                  className={cx("book-cover")}
                />
              </Link>
              <div className={cx("book-info")}>
                <Link
                  href={`/book/${book.id}`}
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

                {book.continueReading && (
                  <div className={cx("continue-reading")}>
                    <Link href={`/book/${book.id}/chapter/${book.newChapter}`}>
                      Đọc tiếp Chapter {book.newChapter}
                    </Link>
                  </div>
                )}
                <Button type="primary" style={{ width: "30%", height: "30px" }}>
                  Xóa
                </Button>
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
