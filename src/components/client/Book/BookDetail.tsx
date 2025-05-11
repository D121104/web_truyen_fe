import styles from "@/styles/BookDetail.module.scss";
import {
  DatabaseFilled,
  EyeFilled,
  HeartFilled,
  LikeFilled,
  LoadingOutlined,
  StepForwardFilled,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import { useState } from "react";

const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(5),
    author: faker.person.fullName(),
    status: faker.helpers.arrayElement(["Đang cập nhật", "Hoàn thành"]),
    genres: faker.helpers.arrayElements(
      ["Adventure", "Manhua", "Supernatural", "Xuyên Không", "Truyện Màu"],
      faker.number.int({ min: 2, max: 5 })
    ),
    translator: faker.company.name(),
    views: faker.number.int({ min: 1000, max: 1000000 }),
    likes: faker.number.int({ min: 10, max: 10000 }),
    follows: faker.number.int({ min: 100, max: 50000 }),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    reviews: faker.number.int({ min: 10, max: 500 }),
    cover: faker.image.url({ width: 160, height: 200 }), // Hình ảnh giả
    description: faker.lorem.paragraphs(2),
    chapters: Array.from(
      { length: faker.number.int({ min: 10, max: 100 }) },
      (_, index) => ({
        chapter: index + 1,
        title: faker.lorem.words(3),
        time: `${faker.number.int({ min: 1, max: 7 })} ngày trước`,
        views: faker.number.int({ min: 1000, max: 10000 }),
      })
    ),
  }));
};

const BookDetail = () => {
  const book = generateFakeBooks(1)[0]; // Lấy một cuốn sách giả

  // State để quản lý hiển thị danh sách chương
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  // Lấy danh sách chương hiển thị (15 chương mới nhất hoặc toàn bộ)
  const chaptersToShow = showAllChapters
    ? book.chapters
    : book.chapters.slice(0, 15);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>{book.title}</h1>
        <div className={styles.updateInfo}>
          <div className={styles.divider} />
          <span>Cập nhật lúc: 09:50 09/05/2025</span>
          <div className={styles.divider} />
        </div>
      </div>

      {/* Metadata Section */}
      <div className={styles.metadata}>
        <div className={styles.cover}>
          <img
            src="https://i0.wp.com/s2.anhvip.xyz/comics/ta-la-ta-de-1698125508.jpg"
            alt=""
          />
        </div>
        <div className={styles.section}>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoName}>
                <UserOutlined
                  style={{ color: "#6c7ee1", marginRight: "10px" }}
                />
                Tác giả:
              </span>
              <span className={styles.infoDetail}>{book.author}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoName}>
                <LoadingOutlined
                  style={{ color: "#4eb09b", marginRight: "10px" }}
                />
                Tình trạng:
              </span>
              <span className={styles.infoDetail}>{book.status}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoName}>
                <TagsOutlined
                  style={{ color: "#f28076", marginRight: "10px" }}
                />
                Thể loại:
              </span>
              <span className={styles.infoDetail}>
                <div className={styles.tags}>
                  {book.genres.map((genre, index) => (
                    <Link
                      href={`/`}
                      key={index}
                      style={{ textDecoration: "none" }}
                    >
                      {" "}
                      <span className={styles.tag}>{genre}</span>
                    </Link>
                  ))}
                </div>
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoName}>
                <TeamOutlined
                  style={{ color: "#01877e", marginRight: "10px" }}
                />
                Nhóm dịch:
              </span>
              <span className={styles.infoDetail}>{book.translator}</span>
            </div>
          </div>
          {/* Stats Section */}
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span>
                <EyeFilled style={{ color: "#f4a82c", marginRight: "10px" }} />
                Lượt xem
              </span>
              <h4>3.170.855</h4>
            </div>
            <div className={styles.statItem}>
              <span>
                <LikeFilled style={{ color: "#3376bc", marginRight: "10px" }} />
                Lượt thích
              </span>
              <h4>936</h4>
            </div>
            <div className={styles.statItem}>
              <span>
                <HeartFilled
                  style={{ color: "#c14d7c", marginRight: "10px" }}
                />
                Theo dõi
              </span>
              <h4>9.422</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      {/* <div className={styles.rating}>
        <h2>TA LÀ TÀ ĐẾ</h2>
        <div className={styles.ratingBox}>
          <span>Xếp hạng: 4.3/5</span>
          <span>153 Lượt đánh giá</span>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={styles.button}
          style={{ backgroundColor: "#f28076" }}
        >
          Đọc từ đầu
        </button>
        <button
          className={styles.button}
          style={{ backgroundColor: "#01877e" }}
        >
          Bỏ theo dõi
        </button>
        <button
          className={styles.button}
          style={{ backgroundColor: "#3376bc" }}
        >
          Thích
        </button>
        <button
          className={styles.button}
          style={{ backgroundColor: "#f4a82c" }}
        >
          Đọc tiếp <StepForwardFilled />;
        </button>
      </div>

      {/* Description */}
      <div className={styles.synopsis}>
        <h3>TÓM TẮT NỘI DUNG</h3>
        <p className={showFullDescription ? styles.full : styles.truncated}>
          {book.description}
        </p>
        <button
          className={styles.toggleButton}
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>

      {/* Chapter List */}
      <div className={styles.chapterSection}>
        <h3>
          <DatabaseFilled style={{ marginRight: "10px" }} />
          DANH SÁCH CHƯƠNG
        </h3>
        <div className={styles.tableHeader}>
          <span className={styles.chapterNumber}>Số chương</span>
          <span className={styles.chapterTime}>Cập nhật</span>
          <span className={styles.chapterViews}>Lượt xem</span>
        </div>
        <div className={styles.chapterList}>
          {chaptersToShow.map((chapter) => (
            <div key={chapter.chapter} className={styles.chapterRow}>
              <Link
                href={`/book/${book.id}/chapter/${chapter.chapter}`}
                style={{
                  textDecoration: "none",
                  color: "#1d1d1d",
                  height: "20px",
                  width: "65%",
                }}
              >
                <div>
                  <span className={styles.chapterNumber}>
                    Chương {chapter.chapter}: {chapter.title}
                  </span>
                </div>
              </Link>{" "}
              <span className={styles.chapterTime}>{chapter.time}</span>
              <span className={styles.chapterViews}>{chapter.views}</span>
            </div>
          ))}
        </div>
        {/* Nút Xem thêm */}
        {!showAllChapters && (
          <button
            className={styles.showMoreButton}
            onClick={() => setShowAllChapters(true)}
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
