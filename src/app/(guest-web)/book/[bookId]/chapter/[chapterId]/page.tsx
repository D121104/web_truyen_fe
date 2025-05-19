"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";

import classNames from "classnames/bind";

import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import Chapter from "@/components/client/Chapter/Chapter";
import { useParams } from "next/navigation";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookId, chapterId } = useParams();

  useEffect(() => {
    dispatch(setPageTitle(""));
  }, []);
  return (
    <Chapter
      bookId={String(bookId ?? "")}
      chapterId={String(chapterId ?? "")}
    />
  );
};

export default Content;
