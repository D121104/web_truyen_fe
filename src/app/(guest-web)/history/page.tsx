"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";

import classNames from "classnames/bind";
import BookNew from "@/components/client/Book/BookNew";

import BookRankSidebar from "@/components/client/Book/BookRank.sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";

import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    dispatch(setPageTitle("Lịch sử đọc truyện"));

    if (!user || !user._id) {
      router.push("/login");
    }
  }, [user, dispatch, router]);

  if (!user || !user._id) {
    return null;
  }

  return (
    <div className={cx("contentWrapper")}>
      <div className={cx("mainWrapper")}>
        <div className={cx("mainContent")}>
          <BookNew />
        </div>
        <div className={cx("sidebar")}>
          <BookRankSidebar />
        </div>
      </div>
    </div>
  );
};

export default Content;
