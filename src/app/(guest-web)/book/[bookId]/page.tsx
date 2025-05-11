"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";
import TrendingBook from "@/components/client/Book/Book.carousel";

import { ThunderboltFilled } from "@ant-design/icons";
import classNames from "classnames/bind";
import BookNew from "@/components/client/Book/BookNew";
import BookSidebar from "@/components/client/Book/Book.sidebar";
import HistorySection from "@/components/client/Book/BookHistorySection";
import BookRankSidebar from "@/components/client/Book/BookRank.sidebar";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import BookDetail from "@/components/client/Book/BookDetail";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle(""));
  }, []);
  return (
    <div className={cx("contentWrapper")}>
      <div className={cx("mainWrapper")}>
        <div className={cx("mainContent")}>
          <BookDetail />
        </div>
        <div className={cx("sidebar")}>
          <BookRankSidebar />
        </div>
      </div>
    </div>
  );
};

export default Content;
