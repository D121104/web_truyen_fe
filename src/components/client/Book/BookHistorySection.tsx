"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import styles from "@/styles/BookHistory.module.scss";
import classNames from "classnames/bind";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Skeleton } from "antd";
import { useAppSelector } from "@/lib/redux/hooks";
import { deleteReadingHistory, getReadingHistory } from "@/config/api";
import { IReadingHistory } from "@/types/backend";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const BookSidebar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const user_id = useAppSelector((state) => state.auth.user._id);

  const [readingHistory, setReadingHistory] = useState<IReadingHistory[]>([]);

  const handleDeleteHistory = async (bookId: string) => {
    try {
      setLoading(true);
      // Call API to delete history
      const res = await deleteReadingHistory(user_id, bookId);
      if (res.code === 200) {
        // Update the state to remove the deleted history
        toast.success("Xóa lịch sử đọc truyện thành công");
        setReadingHistory((prevHistory) => {
          return prevHistory.filter((history) => history.bookId !== bookId);
        });
      } else {
        toast.error("Lỗi khi xóa lịch sử đọc truyện");
      }
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử đọc truyện", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadingHistory = async () => {
    try {
      setLoading(true);
      const res = await getReadingHistory(user_id);
      if (res.code === 200) {
        const history = res.data;
        setReadingHistory(history);
      } else {
        console.error("Lỗi khi lấy lịch sử đọc truyện");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đọc truyện", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingHistory();
  }, [user_id]);

  if (loading) {
    return <Skeleton active />;
  }
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
        {readingHistory.map((history) => (
          <React.Fragment key={history?.bookId}>
            <div className={cx("book-item")}>
              <Link href={`/book/${history?.bookId}?limit=all`}>
                {" "}
                <img
                  src={history?.bookImg}
                  alt={history?.bookTitle}
                  className={cx("book-cover")}
                />
              </Link>
              <div className={cx("book-info")}>
                <Link
                  href={`/book/${history?.bookId}?limit=all`}
                  className={cx("book-title")}
                  style={{
                    textDecoration: "none",
                    color: "#2c3e50",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {history?.bookTitle}
                </Link>

                {history && (
                  <div className={cx("continue-reading")}>
                    <Link
                      href={`/book/${history?.bookId}/chapter/${history.chapterId}`}
                    >
                      Đọc tiếp Chapter {history?.chapterNumber}
                    </Link>
                  </div>
                )}
                <Button
                  type="primary"
                  onClick={() => {
                    handleDeleteHistory(history.bookId);
                  }}
                  style={{ width: "30%", height: "30px" }}
                >
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
