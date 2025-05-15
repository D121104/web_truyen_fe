"use client";

import React, { useEffect, useState } from "react";
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
import { useAppSelector } from "@/lib/redux/hooks";
import { getBooks, getChaptersDetails } from "@/config/api";
import { IBook } from "@/types/backend";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const BookNew: React.FC = () => {
  const pageTitle = useAppSelector((state) => state.auth.pageTitle);
  const [books, setBooks] = useState<IUser[]>([]);
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

  const enrichBooksWithChapters = async (books: IBook[]): Promise<IBook[]> => {
    return await Promise.all(
      books.map(async (book: IBook) => {
        if (book.chapters && book.chapters.length > 0) {
          try {
            const chapters = await getChaptersDetails(book.chapters);
            // Sắp xếp các chapter theo `updatedAt` giảm dần và lấy 3 chapter đầu tiên
            const latestChapters = chapters
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .slice(0, 3);
            return { ...book, chapters: latestChapters }; // Gắn 3 chapter mới nhất vào book
          } catch (error) {
            console.error(
              `Lỗi khi lấy thông tin chương cho sách ${book._id}:`,
              error
            );
            return { ...book, chapters: [] }; // Nếu lỗi, trả về mảng rỗng
          }
        }
        return { ...book, chapters: [] }; // Nếu không có chương, trả về mảng rỗng
      })
    );
  };

  const fetchBooks = async (current = 1, pageSize = 10, title = "") => {
    setLoading(true);
    try {
      const res = await getBooks({ current, pageSize, title });

      if (res.code === 200) {
        const booksWithChapters = await enrichBooksWithChapters(
          res?.data?.result || []
        );
        setBooks(booksWithChapters);
        console.log(books);
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
    fetchBooks();
  }, []);

  return (
    <div className={styles.bookContainer}>
      <section className={cx("section")}>
        <div className={cx("sectionHeader")}>
          <StarFilled style={{ marginLeft: "30px", color: "#f0f0f0" }} />
          <h2>{pageTitle}</h2>
        </div>
      </section>
      <div className={styles.bookGrid}>
        {books.map((book) => (
          <div key={book._id} className={styles.bookCard}>
            <Link href={`/book/${book.id}`} style={{ textDecoration: "none" }}>
              <div className={styles.imageWrapper}>
                <img
                  src={book.imgUrl}
                  alt={book.bookTitle}
                  className={styles.bookImage}
                />
                <div className={styles.overlay}>
                  <span>
                    <EyeFilled /> {book.views}
                  </span>
                  <span>
                    <HeartFilled /> {book.follows}
                  </span>
                  <span>
                    <MessageFilled /> {book.comments}
                  </span>
                </div>
              </div>
            </Link>

            <div className={styles.bookInfo}>
              <Link
                href={`/book/${book._id}`}
                style={{ textDecoration: "none", color: "#1d1d1d" }}
              >
                <h3 className={styles.bookTitle}>{book.bookTitle}</h3>
              </Link>

              <div className={styles.bookChapters}>
                {book.chapters.map((chapter, index) => (
                  <Link
                    key={chapter._id}
                    href={`/book/${book._id}/chapter/${chapter._id}`}
                    style={{ textDecoration: "none", color: "#1d1d1d" }}
                  >
                    <div className={styles.chapter}>
                      <p>Chapter {chapter.chapterNumber} </p>
                      <p>{chapter.updatedAt}</p>
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
};

export default BookNew;
