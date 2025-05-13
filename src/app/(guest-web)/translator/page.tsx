"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";
import classNames from "classnames/bind";

import { useAppDispatch } from "@/lib/redux/hooks";

import RegisterGroup from "@/components/client/TranslatorGroup/RegisterGroup";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  //   const dispatch = useAppDispatch();

  // //   useEffect(() => {
  // //     dispatch(setPageTitle("Truyện theo thể loại"));
  // //   }, []);

  return (
    <div className={cx("contentWrapper")}>
      <div className={cx("mainWrapper")}>
        <RegisterGroup />
      </div>
    </div>
  );
};

export default Content;
