"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";
import classNames from "classnames/bind";
import BookNew from "@/components/client/Book/BookNew";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import CategoriesGrid from "@/components/client/Category/CategoryGrid";
import FilterSection from "@/components/client/Category/FilterSection";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Truyện theo thể loại"));
  }, []);
  return (
    <div className={cx("contentWrapper")}>
      <div className={cx("mainWrapper")}>
        <div className={cx("mainContent")}>
          <FilterSection />
          <BookNew />
        </div>
        <div className={cx("sidebar")}>
          <CategoriesGrid />
        </div>
      </div>
    </div>
  );
};

export default Content;
