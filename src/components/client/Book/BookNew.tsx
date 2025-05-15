import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import { getBooks } from "@/config/api";
import { IBook } from "@/types/backend";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import styles from "@/styles/BookNew.module.scss";
import classNames from "classnames/bind";
import {
  EyeFilled,
  HeartFilled,
  MessageFilled,
  StarFilled,
} from "@ant-design/icons";

const cx = classNames.bind(styles);

const BookNew: React.FC = () => {
  const pageTitle = useAppSelector((state) => state.auth.pageTitle);
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

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
    fetchBooks(page, pagination.pageSize); // Fetch lại API với trang mới
  };

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
            <Link href={`/book/${book._id}`} style={{ textDecoration: "none" }}>
              <div className={styles.imageWrapper}>
                <img
                  src={book.imgUrl}
                  alt={book.bookTitle}
                  className={styles.bookImage}
                />
                <div className={styles.overlay}>
                  <span>
                    <EyeFilled /> {book.view ?? 0}
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
                href={`/book/${book._id}`}
                style={{ textDecoration: "none", color: "#1d1d1d" }}
              >
                <h3 className={styles.bookTitle}>{book.bookTitle}</h3>
              </Link>

              <div className={styles.bookChapters}>
                {book.chapters?.length > 0 &&
                  book.chapters.map((chapter, index) => (
                    <Link
                      key={chapter._id}
                      href={`/book/${book._id}/chapter/${chapter._id}`}
                      style={{ textDecoration: "none", color: "#1d1d1d" }}
                    >
                      <div className={styles.chapter}>
                        <p>Chapter {chapter.chapterNumber} </p>
                        <p>{dayjs(chapter.updatedAt).format("DD/MM/YYYY")}</p>
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
          current={pagination.current} // Trang hiện tại
          pageSize={pagination.pageSize} // Số item mỗi trang
          total={pagination.total} // Tổng số item
          onChange={handlePageChange} // Hàm xử lý khi đổi trang
          showTotal={(total) => `Tổng ${total} truyện`} // Hiển thị tổng số item
          showQuickJumper
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default BookNew;
