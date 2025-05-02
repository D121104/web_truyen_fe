"use client";

import React from "react";
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";
import styles from "@/styles/CategoryDropdown.module.scss";
import Link from "next/link";

const onClick: MenuProps["onClick"] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
  },
  {
    label: "2nd menu item",
    key: "2",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];
const categories = [
  ["Tất cả", "Action", "Adult", "Adventure"],
  ["Anime", "Chuyển Sinh", "Comedy", "Cooking"],
  ["Comic", "Cổ Đại", "Drama", "Đam Mỹ"],
  ["Ecchi", "Fantasy", "Harem", "Historical"],
  ["Horror", "Live action", "Manga", "Manhua"],
  ["Manhwa", "Martial Arts", "Mature", "Mystery"],
  ["Mecha", "Ngôn Tình", "One shot", "Psychological"],
  ["Romance", "School Life", "Shoujo", "Shoujo Ai"],
  ["Shounen", "Slice of Life", "Seinen", "Smut"],
  ["Sci-fi", "Soft Yaoi", "Soft Yuri", "Sports"],
  ["Supernatural", "Josei", "Thiếu Nhi", "Trinh Thám"],
  ["Truyện Màu", "Tragedy", "Webtoon", "Xuyên Không"],
  ["Gender Bender", "Yuri", "Hệ Thống", "Yaoi"],
];

const CategoryDropdown: React.FC = () => {
  const overlay = (
    <div className={styles.dropdownContent}>
      {categories.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((item, colIndex) => (
            <div key={colIndex} className={styles.cell}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <Dropdown overlay={overlay} trigger={["hover"]} placement="bottom">
      <Link href=""></Link>
    </Dropdown>
  );
};

export default CategoryDropdown;
