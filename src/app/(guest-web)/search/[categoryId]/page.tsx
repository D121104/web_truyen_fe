"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";
import classNames from "classnames/bind";
import BookNew from "@/components/client/Book/BookNew";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import CategoriesGrid from "@/components/client/Category/CategoryGrid";
import FilterSection from "@/components/client/Category/FilterSection";
import { useParams } from "next/navigation";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categoryId } = useParams(); // Example categoryId, replace with actual value
  useEffect(() => {
    dispatch(setPageTitle("Truyện theo thể loại"));
  }, []);
  return <>{categoryId}</>;
};

export default Content;
