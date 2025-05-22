"use client";

import styles from "@/styles/FilterSection.module.scss";
import { useState, useEffect, Suspense } from "react";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";

const CategoryFilterContent = () => {
  const filterGroups = [
    {
      title: "Trạng thái",
      key: "status",
      items: [
        { label: "Tất cả", key: "" },
        { label: "Hoàn thành", key: "completed" },
        { label: "Đang tiến hành", key: "inProgress" },
      ],
    },
    {
      title: "Lượt đọc",
      key: "period",
      items: [
        { label: "Top all", key: "" },
        { label: "Top tháng", key: "month" },
        { label: "Top tuần", key: "week" },
      ],
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy categoryId từ query hiện tại (nếu có)
  const categoryId = searchParams.get("categoryId");

  // Lấy giá trị mặc định từ query nếu có
  const getSortOptionsFromParams = () =>
    filterGroups.map((group) => {
      const value = searchParams.get(group.key);
      return value || group.items[0].key;
    });

  const [sortOptions, setSortOptions] = useState(getSortOptionsFromParams);

  // Khi router thay đổi (params thay đổi), cập nhật lại sortOptions
  useEffect(() => {
    setSortOptions(getSortOptionsFromParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Khi sortOptions thay đổi, cập nhật query trên URL và giữ lại categoryId nếu có
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    filterGroups.forEach((group, idx) => {
      params.set(group.key, sortOptions[idx]);
    });
    router.push(`/search?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOptions, categoryId]);

  const handleOptionClick = (groupIndex: number, itemKey: string) => {
    setSortOptions((prev) => {
      const newSortOptions = [...prev];
      newSortOptions[groupIndex] = itemKey;
      return newSortOptions;
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.mainTitle}>Truyện thể loại Tất cả</h2>
      <p className={styles.subTitle}>Tất cả thể loại truyện tranh</p>

      <div className={styles.filterGroups}>
        {filterGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={styles.filterGroup}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.filterItems}>
              {group.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={classNames(styles.filterItem, {
                    [styles.active]: sortOptions[groupIndex] === item.key,
                  })}
                  onClick={() => handleOptionClick(groupIndex, item.key)}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryFilter = (props: any) => (
  <Suspense>
    <CategoryFilterContent {...props} />
  </Suspense>
);

export default CategoryFilter;
