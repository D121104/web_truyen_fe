"use client";

import React from "react";
import styles from "@/styles/Content.module.scss";
import TrendingBook from "@/components/client/Book/Book.carousel";

import { ThunderboltFilled } from "@ant-design/icons";
import classNames from "classnames/bind";
import BookNew from "@/components/client/Book/BookNew";
import BookSidebar from "@/components/client/Book/Book.sidebar";
import HistorySection from "@/components/client/Book/BookHistorySection";
import BookRankSidebar from "@/components/client/Book/BookRank.sidebar";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  return (
    <div className={cx("contentWrapper")}>
      {/* Truyện nổi bật */}
      <section className={cx("section")}>
        <div className={cx("sectionHeader")}>
          <ThunderboltFilled style={{ marginLeft: "30px", color: "#f0f0f0" }} />
          <h2>Truyện nổi bật</h2>
        </div>
        <TrendingBook />
      </section>
      <div className={cx("mainWrapper")}>
        <div className={cx("mainContent")}>
          <BookNew />
        </div>
        <div className={cx("sidebar")}>
          <BookSidebar />
          <HistorySection />
          <BookRankSidebar />
        </div>
      </div>
    </div>
  );
};

export default Content;
