"use client";

import React from "react";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import styles from "@/styles/BookRankSidebar.module.scss";
import classNames from "classnames/bind";
import {
  BookOutlined,
  ClockCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
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
    view: faker.number.int({ min: 1000, max: 100000 }),
  }));
};

const books = generateFakeBooks(10);

const BookRankSidebar: React.FC = () => {
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
          <React.Fragment key={book.id}>
            <div className={cx("book-item")}>
              <div className={cx("book-rank")}>
                {index + 1 < 10 ? "0" + (index + 1).toString() : index + 1}{" "}
              </div>

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
                  <div className={cx("book-view")}>
                    <EyeOutlined />
                    {book.view}
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
