import styles from "@/styles/Chapter.module.scss";
import {
  HeartOutlined,
  MenuOutlined,
  ReloadOutlined,
  HomeFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { faker } from "@faker-js/faker";

const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(5),
    chapters: [
      {
        chapter: faker.number.int({ min: 1, max: 100 }),
        time: `${faker.number.int({ min: 1, max: 60 })} phút trước`,
      },
      {
        chapter: faker.number.int({ min: 1, max: 100 }),
        time: `${faker.number.int({ min: 1, max: 24 })} giờ trước`,
      },
      {
        chapter: faker.number.int({ min: 1, max: 100 }),
        time: `${faker.number.int({ min: 1, max: 7 })} ngày trước`,
      },
    ],
    views: faker.number.int({ min: 1000, max: 100000 }),
    likes: faker.number.int({ min: 10, max: 1000 }),
    follows: faker.number.int({ min: 100, max: 5000 }),
    comments: faker.number.int({ min: 10, max: 500 }),
    cover: faker.image.url({ width: 160, height: 200 }), // Hình ảnh giả
  }));
};

const Chapter = () => {
  const img = "//s2.anhvip.xyz/comics/top/toptruyentv6.jpg"; // Hình ảnh giả
  return (
    <div className={styles.chapterContainer}>
      <div className={styles.chapterHeader}>
        {/* Navigation Section */}
        <div className={styles.navigation}>
          <button className={styles.icon}>
            <HomeFilled />
          </button>
          <button className={styles.icon}>
            <MenuOutlined />
          </button>
          <button className={styles.icon}>
            <ReloadOutlined />
          </button>
          <button className={styles.navButton}>
            <ArrowLeftOutlined style={{ color: "#fff" }} />
          </button>
        </div>

        {/* Chapter Info */}
        <div className={styles.chapterInfo}>
          <select className={styles.chapterSelect}>
            <option>Chapter 3831</option>
            <option>Chapter 3830</option>
            <option>Chapter 3829</option>
          </select>
        </div>

        {/* Follow Button */}
        <button className={styles.followButton}>
          <HeartOutlined />
          Theo dõi
        </button>
      </div>

      {/* Chapter Content */}
      <div className={styles.chapterContent}>
        <img src={img} alt="Chapter Content" className={styles.chapterImage} />
      </div>
    </div>
  );
};

export default Chapter;
