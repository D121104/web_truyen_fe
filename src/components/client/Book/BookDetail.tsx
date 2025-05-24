"use client";

import styles from "@/styles/BookDetail.module.scss";
import { IBook, IChapter } from "@/types/backend";
import {
  DatabaseFilled,
  EyeFilled,
  HeartFilled,
  LikeFilled,
  LoadingOutlined,
  LockOutlined,
  TagsOutlined,
  TeamOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { followBook, likeBook, unfollowBook, unlikeBook } from "@/config/api";
import { fetchAccount } from "@/lib/redux/slice/auth.slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSpin from "@/components/client/Spin/LoadingSpin";

dayjs.extend(relativeTime);

interface IProps {
  book: IBook;
}

const BookDetail: React.FC<IProps> = (props: IProps) => {
  const { book } = props;
  const [totalViews, setTotalViews] = useState(0);
  const user = useAppSelector((state) => state.auth.user);
  const books = useAppSelector((state) => state.auth.user.books);
  const [loading, setLoading] = useState(false);
  const isFollowing = books?.includes(book?._id as any);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useAppDispatch();

  // State để quản lý hiển thị danh sách chương
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  // const [chaptersToShow, setChaptersToShow] = useState<IChapter[]>([]);
  // Lấy danh sách chương hiển thị (15 chương mới nhất hoặc toàn bộ)

  const [chaptersToShow, setChaptersToShow] = useState<IChapter[]>([]);

  useEffect(() => {
    // Nếu không có chương nào, ẩn nút "Xem thêm"
    if (book.chapters.length === 0) {
      setShowAllChapters(false);
    }
    const totalViews = book.chapters.reduce((acc, chapter) => {
      return acc + (chapter.views || 0);
    }, 0);
    setTotalViews(totalViews);
    if (!showAllChapters) {
      setChaptersToShow(book?.chapters.slice(0, 15));
    } else {
      setChaptersToShow(book?.chapters);
    }
  }, [book.chapters, setChaptersToShow, showAllChapters]);

  const handleFollow = async () => {
    if (!user?._id) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isFollowing) {
        res = await unfollowBook(user._id, book?._id as any);
      } else {
        res = await followBook(user._id, book?._id as any);
      }
      if (res.code === 200) {
        dispatch(fetchAccount());
        console.log("user", user);
        if (isFollowing) {
          toast.success("Đã bỏ theo dõi sách");
          console.log("Đã bỏ theo dõi sách");
        } else {
          toast.success("Đã theo dõi sách");
          console.log("Đã theo dõi sách");
        }
      } else {
        toast.error("Lỗi khi xử lý theo dõi");
        console.error("Lỗi khi xử lý theo dõi", res.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu theo dõi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && book?.likes) {
      setIsLiked(book.likes.includes(user?._id as any));
    }
  }, [user?._id, book?.likes]);

  const handleLike = async () => {
    if (!user?._id) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isLiked) {
        res = await unlikeBook(user._id, book?._id as any);
      } else {
        res = await likeBook(user._id, book?._id as any);
      }
      if (res.code === 201) {
        setIsLiked(!isLiked);
        // Cập nhật lại số lượng like ngay lập tức trên UI
        if (res.data && res.data.likes) {
          book.likes = res.data.likes;
        }
        dispatch(fetchAccount());
        if (isLiked) {
          toast.success("Đã bỏ thích sách");
          console.log("Đã bỏ thích sách");
        } else {
          toast.success("Đã thích sách");
          console.log("Đã thích sách");
        }
      } else {
        toast.error("Lỗi khi xử lý thích sách");
        console.error("Lỗi khi xử lý thích sách", res.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu thích sách", error);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  // const [buyModalOpen, setBuyModalOpen] = useState(false);
  // interface HandleClickParams {
  //   isBought: boolean;
  //   chapter: IChapter;
  // }

  const handleClick = (chapter: IChapter): void => {
    router.push(`/book/${book?._id}/chapter/${chapter?._id}`);
  };

  const readChapBegin = () => {
    if (book.chapters.length > 0) {
      const firstChapter = book.chapters[0];
      router.push(`/book/${book?._id}/chapter/${firstChapter?._id}`);
    } else {
      console.warn("Không có chương nào để đọc");
    }
  };

  const readNewChapter = () => {
    if (book.chapters.length > 0) {
      const newChapter = book.chapters[book.chapters.length - 1];
      router.push(`/book/${book?._id}/chapter/${newChapter?._id}`);
    } else {
      console.warn("Không có chương nào để đọc");
    }
  };

  if (typeof user === "undefined") return null;

  if (loading) {
    return <LoadingSpin></LoadingSpin>;
  }
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
                  {book.categories.map((genre, index) => (
                    <Link
                      href={`/`}
                      key={index}
                      style={{ textDecoration: "none" }}
                    >
                      {" "}
                      <span className={styles.tag}>{genre.categoryName}</span>
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
              <h4>{totalViews}</h4>
            </div>
            <div className={styles.statItem}>
              <span>
                <LikeFilled style={{ color: "#3376bc", marginRight: "10px" }} />
                Lượt thích
              </span>
              <h4>{book?.likes?.length}</h4>
            </div>
            <div className={styles.statItem}>
              <span>
                <HeartFilled
                  style={{ color: "#c14d7c", marginRight: "10px" }}
                />
                Theo dõi
              </span>
              <h4>{book?.users?.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section */}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={styles.button}
          style={{ backgroundColor: "#f28076" }}
          onClick={readChapBegin}
        >
          Đọc từ đầu
        </button>
        {isFollowing ? (
          <button
            className={styles.button}
            style={{ backgroundColor: "#f7444e" }}
            onClick={handleFollow}
          >
            Bỏ theo dõi
          </button>
        ) : (
          <button
            className={styles.button}
            style={{ backgroundColor: "#01877e" }}
            onClick={handleFollow}
          >
            Theo dõi
          </button>
        )}

        <button
          className={styles.button}
          style={{ backgroundColor: "#3376bc" }}
          onClick={handleLike}
        >
          {isLiked ? "Bỏ thích" : "Thích"}
        </button>
        <button
          className={styles.button}
          style={{ backgroundColor: "#f4a82c" }}
          onClick={readNewChapter}
        >
          Đọc mới nhất
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
          {chaptersToShow.map((chapter: IChapter) => {
            const isBought = user && chapter.users?.includes(user._id);
            return (
              <div key={chapter.chapterNumber} className={styles.chapterRow}>
                <div>
                  <span
                    className={styles.chapterNumber}
                    onClick={() => handleClick(chapter)}
                  >
                    Chương {chapter.chapterNumber}: {chapter.chapterTitle}
                  </span>
                </div>
                <div className={styles.chapterInfo}>
                  {isBought ? (
                    <div className={styles.chapterPrice}>
                      <>{chapter?.price}</>
                      <UnlockOutlined style={{ color: "yellow" }} />
                    </div>
                  ) : (
                    <div className={styles.chapterPrice}>
                      <>{chapter?.price}</>
                      <LockOutlined
                        style={{ color: "red", marginLeft: "10px" }}
                      />
                    </div>
                  )}
                  <span className={styles.chapterTime}>
                    {dayjs().diff(dayjs(chapter.createdAt), "day") > 7
                      ? dayjs(chapter.createdAt).format("DD/MM/YYYY")
                      : dayjs(chapter.createdAt).fromNow()}
                  </span>
                  <span className={styles.chapterViews}>{chapter.views}</span>
                </div>
                {/* <Popconfirm
                  title={`Bạn có chắc chắn muốn mua chương này với ${chapter.price} coin?`}
                  open={buyModalOpen}
                ></Popconfirm> */}
              </div>
            );
          })}
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
