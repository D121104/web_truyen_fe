"use client";

import React from "react";
import { Dropdown, MenuProps, Space } from "antd";
import {
  EyeOutlined,
  SyncOutlined,
  CheckOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import styles from "@/styles/RankingDropdown.module.scss";

const RankingDropdown: React.FC = () => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={styles.menuItem}>
          <EyeOutlined />
          Top all
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className={styles.menuItem}>
          <EyeOutlined />
          Top tháng
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className={styles.menuItem}>
          <EyeOutlined />
          Top tuần
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div className={styles.menuItem}>
          <EyeOutlined />
          Top ngày
        </div>
      ),
    },
    {
      type: "divider", // Dòng phân cách
    },
    {
      key: "5",
      label: (
        <div className={styles.menuItem}>
          <SyncOutlined />
          Mới cập nhật
        </div>
      ),
    },
    {
      key: "6",
      label: (
        <div className={styles.menuItem}>
          <CheckOutlined />
          Đã hoàn thành
        </div>
      ),
    },
    {
      key: "7",
      label: (
        <div className={styles.menuItem}>
          <LikeOutlined />
          Yêu thích
        </div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["hover"]} placement="bottom">
      <a onClick={(e) => e.preventDefault()}></a>
    </Dropdown>
  );
};

export default RankingDropdown;
