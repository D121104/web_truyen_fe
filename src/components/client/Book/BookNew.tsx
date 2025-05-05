"use client";

import React from "react";
import { faker } from "@faker-js/faker";
import styles from "@/styles/BookNew.module.scss"; // Đường dẫn đến file CSS của bạn
import classNames from "classnames/bind";
import {
  EyeFilled,
  HeartFilled,
  MessageFilled,
  StarFilled,
} from "@ant-design/icons";
import { Pagination } from "antd";
import Link from "next/link";

const cx = classNames.bind(styles);
const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(5),
    chapters: [
      {
        chapter: faker.number.int({ min: 1, max: 100 }),
        time: `${faker.number.int({ min: 1, max: 60 })} phút trước`,
      },
      {
        chapter: faker.number.int({ min: 1, max: 100 }),
        time: `${faker.number.int({ min: 1, max: 24 })} giờ trước`,
      },
      {
        chapter: faker.number.int({ min: 1, max: 100 }),
        time: `${faker.number.int({ min: 1, max: 7 })} ngày trước`,
      },
    ],
    views: faker.number.int({ min: 1000, max: 100000 }),
    likes: faker.number.int({ min: 10, max: 1000 }),
    comments: faker.number.int({ min: 10, max: 500 }),
    cover: faker.image.url({ width: 160, height: 200 }), // Hình ảnh giả
  }));
};

const books = generateFakeBooks(36); // Tạo 8 sách giả

const BookNew: React.FC = () => (
  <div className={styles.bookContainer}>
    <section className={cx("section")}>
      <div className={cx("sectionHeader")}>
        <StarFilled style={{ marginLeft: "30px", color: "#f0f0f0" }} />
        <h2>Truyện mới cập nhật</h2>
      </div>
    </section>
    <div className={styles.bookGrid}>
      {books.map((book) => (
        <div key={book.id} className={styles.bookCard}>
          <Link href={`/books/${book.id}`} style={{ textDecoration: "none" }}>
            <div className={styles.imageWrapper}>
              <img
                src={book.cover}
                alt={book.title}
                className={styles.bookImage}
              />
              <div className={styles.overlay}>
                <span>
                  <EyeFilled /> {book.views.toLocaleString()}
                </span>
                <span>
                  <HeartFilled /> {book.likes}
                </span>
                <span>
                  <MessageFilled /> {book.comments}
                </span>
              </div>
            </div>
          </Link>

          <div className={styles.bookInfo}>
            <Link
              href={`/books/${book.id}`}
              style={{ textDecoration: "none", color: "#1d1d1d" }}
            >
              <h3 className={styles.bookTitle}>{book.title}</h3>
            </Link>

            <div className={styles.bookChapters}>
              {book.chapters.map((chapter, index) => (
                <Link
                  key={chapter.chapter}
                  href={`/books/${book.id}/chapter/${chapter.chapter}`}
                  style={{ textDecoration: "none", color: "#1d1d1d" }}
                >
                  <div className={styles.chapter}>
                    <p>Chapter {chapter.chapter}</p>
                    <p>{chapter.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    <Pagination
      showQuickJumper
      showSizeChanger={false}
      defaultCurrent={2}
      total={500}
      align="center"
      style={{ marginTop: "20px" }}
    />
  </div>
);

export default BookNew;
