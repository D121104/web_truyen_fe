import styles from "@/styles/CategoriesGrid.module.scss";

const CategoriesGrid = () => {
  const categories = [
    "Action",
    "Adult",
    "Adventure",
    "Anime",
    "Chuyển Sinh",
    "Comedy",
    "Cooking",
    "Comic",
    "Cổ Đại",
    "Drama",
    "Đam Mỹ",
    "Ecchi",
    "Fantasy",
    "Harem",
    "Historical",
    "Horror",
    "Live action",
    "Manga",
    "Manhua",
    "Manhwa",
    "Martial Arts",
    "Mature",
    "Mystery",
    "Mecha",
    "Ngôn Tình",
    "One shot",
    "Psychological",
    "Romance",
    "School Life",
    "Shoujo",
    "Shoujo Ai",
    "Shounen",
    "Slice of Life",
    "Seinen",
    "Smut",
    "Sci-fi",
    "Soft Yaoi",
    "Soft Yuri",
    "Sports",
    "Supernatural",
    "Josei",
    "Thiếu Nhi",
    "Trinh Thám",
    "Truyện Màu",
    "Tragedy",
    "Webtoon",
    "Xuyên Không",
    "Gender Bender",
    "Yuri",
    "Hệ Thống",
    "Yaoi",
  ];

  // Chia mảng thành các cặp
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    chunkedCategories.push(categories.slice(i, i + 2));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tất cả thể loại</h2>
      <div className={styles.grid}>
        {chunkedCategories.map((pair, index) => (
          <div key={index} className={styles.row}>
            {pair.map((category, subIndex) => (
              <div key={subIndex} className={styles.categoryItem}>
                {category}
              </div>
            ))}
            {/* Thêm item trống nếu cần */}
            {pair.length < 2 && <div className={styles.emptyItem}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
