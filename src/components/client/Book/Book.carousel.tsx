"use client";

import React, { useEffect, useState } from "react";
import { Carousel, Skeleton } from "antd";
import { faker } from "@faker-js/faker";
import styles from "@/styles/BookCarousel.module.scss"; // Import file SCSS
import Link from "next/link";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getBooks } from "@/config/api";
import { IBook } from "@/types/backend";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const TrendingBook: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 0,
  });

  const fetchBooks = async (current = 1, pageSize = 10, title = "") => {
    setLoading(true);
    try {
      const res = await getBooks({ current, pageSize, title });

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

  useEffect(() => {
    fetchBooks(pagination.current, pagination.pageSize);
  }, []);

  if (loading) {
    return <Skeleton active />;
  }
  return (
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
          key={book._id}
          style={{
            padding: "0 10px", // Tăng khoảng cách giữa các slide
            boxSizing: "border-box", // Đảm bảo padding không ảnh hưởng đến kích thước
          }}
        >
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <Link
                href={`/book/${book._id}?limit=all`}
                className={styles.link}
              >
                <img
                  src={book.imgUrl}
                  alt={book.bookTitle}
                  className={styles.image}
                />
              </Link>

              <div className={styles.overlay}>
                <Link
                  href={`/book/${book._id}?limit=all`}
                  className={styles.link}
                >
                  <h3 className={styles.title}>{book.bookTitle}</h3>
                </Link>

                <div className={styles.infoRow}>
                  <Link
                    href={`/book/${book._id}/chapter/${book.chapters[0]?._id}`}
                    style={{
                      textDecoration: "none",
                      color: "#cccccc",
                      fontSize: "12px",
                    }}
                  >
                    <p className={styles.chapter}>
                      Chapter {book.chapters[0]?.chapterNumber}{" "}
                    </p>
                  </Link>

                  <p className={styles.time}>
                    <ClockCircleOutlined style={{ marginRight: "5px" }} />

                    {dayjs().diff(dayjs(book.chapters[0]?.createdAt), "day") > 7
                      ? dayjs(book.chapters[0]?.createdAt).format("DD/MM/YYYY")
                      : dayjs(book.chapters[0]?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default TrendingBook;
