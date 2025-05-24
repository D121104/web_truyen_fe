"use client";
import React, { useEffect } from "react";
import classnames from "classnames/bind";
import styles from "@/styles/TranslatorPage.module.scss";

import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import BookList from "@/components/client/TranslatorGroup/BookList";
import { BookOutlined } from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";

const cx = classnames.bind(styles);

type MenuItem = Required<MenuProps>["items"][number];

const TranslatorPage = () => {
  const dispatch = useAppDispatch();

  const items: MenuItem[] = [
    {
      key: "1",
      label: "Truyện của nhóm",
      icon: <BookOutlined />,
    },
  ];

  useEffect(() => {
    dispatch(setPageTitle("Truyện của nhóm"));
  }, []);
  return (
    <div className={cx("translatorPage")}>
      <div className={cx("sidebar")}>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="light"
          items={items}
        />
      </div>
      <div className={cx("content")}>
        <div>
          <div className={cx("contentList")}>
            <BookList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorPage;
