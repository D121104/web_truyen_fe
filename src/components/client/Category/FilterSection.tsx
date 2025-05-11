import styles from "@/styles/FilterSection.module.scss";

const CategoryFilter = () => {
  const filterGroups = [
    {
      title: "Tất cả thể loại",
      items: ["Tất cả", "Hoàn thành", "Đang tiến hành"],
    },
    {
      title: "Ngày cập nhật",
      items: ["Top all", "Top tháng", "Top tuần"],
    },
    {
      title: "Top",
      items: ["Số chapter", "Theo dõi", "Bình luận"],
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.mainTitle}>Truyện thể loại Tất cả</h2>
      <p className={styles.subTitle}>Tất cả thể loại truyện tranh</p>

      <div className={styles.filterGroups}>
        {filterGroups.map((group, index) => (
          <div key={index} className={styles.filterGroup}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.filterItems}>
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex} className={styles.filterItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
