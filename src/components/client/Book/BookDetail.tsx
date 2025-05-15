import styles from "@/styles/BookDetail.module.scss";
import { IBook, IChapter } from "@/types/backend";
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
import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

dayjs.extend(relativeTime);

interface IProps {
  book: IBook;
}

const BookDetail: React.FC<IProps> = (props: IProps) => {
  const { book } = props;

  // State để quản lý hiển thị danh sách chương
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  // Lấy danh sách chương hiển thị (15 chương mới nhất hoặc toàn bộ)
  console.log("book", book);
  const chaptersToShow = showAllChapters
    ? book.chapters ?? []
    : book.chapters.slice(0, 15);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>{book.bookTitle}</h1>
        <div className={styles.updateInfo}>
          <div className={styles.divider} />
          <span>
            Cập nhật lúc: {dayjs(book.updatedAt).format("DD/MM/YYYY")}
          </span>
          <div className={styles.divider} />
        </div>
      </div>

      {/* Metadata Section */}
      <div className={styles.metadata}>
        <div className={styles.cover}>
          <img src={book.imgUrl} alt="" />
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
              <span className={styles.infoDetail}>
                {book.status ?? "Hoàn thành"}
              </span>
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
                  {book.categories.map((genre, index) => (
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
              <span className={styles.infoDetail}>
                {book.translatorGroup?.groupName ?? "No Name"}
              </span>
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
          {chaptersToShow.map((chapter: IChapter) => (
            <div key={chapter.chapterNumber} className={styles.chapterRow}>
              <Link
                href={`/book/${book._id}/chapter/${chapter._id}`}
                style={{
                  textDecoration: "none",
                  color: "#1d1d1d",
                  height: "20px",
                  width: "65%",
                }}
              >
                <div>
                  <span className={styles.chapterNumber}>
                    Chương {chapter.chapterNumber}: {chapter.chapterTitle}
                  </span>
                </div>
              </Link>{" "}
              <span className={styles.chapterTime}>
                {dayjs(chapter.updatedAt).fromNow()}
              </span>
              <span className={styles.chapterViews}>{0}</span>
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
