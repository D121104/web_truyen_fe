"use client";
import React, { useEffect, useState } from "react";
import classnames from "classnames/bind";
import styles from "@/styles/TranslatorPage.module.scss";

import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setOpenAddBook, setPageTitle } from "@/lib/redux/slice/auth.slice";
import BookList from "@/components/client/TranslatorGroup/BookList";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import AddBookModal from "@/components/client/TranslatorGroup/AddBookModal";
const cx = classnames.bind(styles);

type MenuItem = Required<MenuProps>["items"][number];

const TranslatorPage = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const items: MenuItem[] = [
    { key: "1", icon: <PieChartOutlined />, label: "Thành viên" },
    {
      key: "sub1",
      label: "Truyện của nhóm",
      icon: <MailOutlined />,
      children: [
        { key: "2", label: "Danh sách truyện" },
        { key: "3", label: "Thêm truyện", onClick: () => setOpen(true) },
      ],
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
          <div className={cx("contentTitle")}>Truyện của nhóm</div>
          <div className={cx("contentList")}>
            <BookList />
            {open && <AddBookModal open={open} setOpen={setOpen} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorPage;
