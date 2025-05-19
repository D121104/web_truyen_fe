"use client";

import { getCategories } from "@/config/api";
import styles from "@/styles/CategoriesGrid.module.scss";
import { ICategory } from "@/types/backend";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";

const CategoriesGrid = () => {
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
        setCategories(res?.data?.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Skeleton active />;
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tất cả thể loại</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category._id} className={styles.category}>
            <a
              href={`/search?categoryId=${category._id}`}
              className={styles.link}
            >
              {category.categoryName}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
