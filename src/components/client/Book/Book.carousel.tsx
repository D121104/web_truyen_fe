"use client";

import React from "react";
import { Carousel } from "antd";
import { faker } from "@faker-js/faker";
import styles from "@/styles/BookCarousel.module.scss"; // Import file SCSS
import Link from "next/link";
import { ClockCircleOutlined } from "@ant-design/icons";

const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(2),
    chapter: faker.number.int({ min: 1, max: 1000 }),
    time: `${faker.number.int({ min: 1, max: 24 })} giờ trước`,
    cover: faker.image.url({ width: 160, height: 200 }), // Hình ảnh giả
  }));
};

const books = generateFakeBooks(10); // Tạo 10 sách giả

const TrendingBook: React.FC = () => (
  <Carousel
    arrows
    infinite={true}
    slidesToShow={5}
    swipeToSlide={true}
    draggable={true}
    autoplay={true}
  >
    {books.map((book) => (
      <div
        key={book.id}
        style={{
          padding: "0 10px", // Tăng khoảng cách giữa các slide
          boxSizing: "border-box", // Đảm bảo padding không ảnh hưởng đến kích thước
        }}
      >
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <Link href={`/book/${book.id}`} className={styles.link}>
              <img src={book.cover} alt={book.title} className={styles.image} />
            </Link>

            <div className={styles.overlay}>
              <Link href={`/book/${book.id}`} className={styles.link}>
                <h3 className={styles.title}>{book.title}</h3>
              </Link>

              <div className={styles.infoRow}>
                <Link
                  href={`/book/${book.id}/chapter/${book.chapter}`}
                  style={{
                    textDecoration: "none",
                    color: "#cccccc",
                    fontSize: "12px",
                  }}
                >
                  <p className={styles.chapter}>Chapter {book.chapter}</p>
                </Link>

                <p className={styles.time}>
                  <ClockCircleOutlined style={{ marginRight: "5px" }} />
                  {book.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Carousel>
);

export default TrendingBook;
