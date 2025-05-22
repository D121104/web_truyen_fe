"use client";

import { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";
import styles from "@/styles/CategoryDropdown.module.scss";
import Link from "next/link";
import { ICategory } from "@/types/backend";
import { getCategories } from "@/config/api";

const onClick: MenuProps["onClick"] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const CategoryDropdown: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getCategories({ current: 1, pageSize: 100 });
        if (res.code !== 200) {
          throw new Error("Failed to fetch categories");
        }
        setCategories(res?.data?.result as any);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const overlay = (
    <div className={styles.dropdownContent}>
      <ul className={styles.dropdownList}>
        {categories.map((category) => (
          <li key={category._id} className={styles.dropdownItem}>
            <Link
              href={`/search?categoryId=${category._id}`}
              className={styles.dropdownLink}
            >
              {category.categoryName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Dropdown overlay={overlay} trigger={["hover"]} placement="bottom">
      <Link href={`/search/`} className={styles.dropdownLink}></Link>
    </Dropdown>
  );
};

export default CategoryDropdown;
