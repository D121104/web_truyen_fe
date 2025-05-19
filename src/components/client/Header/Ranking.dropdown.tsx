"use client";

import React from "react";
import { Dropdown, MenuProps, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import styles from "@/styles/RankingDropdown.module.scss";
import { useRouter } from "next/navigation";

const RankingDropdown: React.FC = () => {
  const router = useRouter();

  const handleClick = (key: string) => {
    switch (key) {
      case "1":
        router.push("/search?status=&period=");
        break;
      case "2":
        router.push("/search?status=&period=month");
        break;
      case "3":
        router.push("/search?status=&period=week");
        break;
      default:
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={styles.menuItem} onClick={() => handleClick("1")}>
          <EyeOutlined />
          Top all
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className={styles.menuItem} onClick={() => handleClick("2")}>
          <EyeOutlined />
          Top tháng
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className={styles.menuItem} onClick={() => handleClick("3")}>
          <EyeOutlined />
          Top tuần
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
