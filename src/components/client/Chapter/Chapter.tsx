import LoadingSpin from "@/components/client/Spin/LoadingSpin";
import {
  buyChapter,
  followBook,
  getBookById,
  saveReadingHistory,
  unfollowBook,
  updateChapter,
} from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchAccount } from "@/lib/redux/slice/auth.slice";
import styles from "@/styles/Chapter.module.scss";
import { IBook, IChapter } from "@/types/backend";
import {
  HeartOutlined,
  MenuOutlined,
  ReloadOutlined,
  HomeFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface IProps {
  bookId: string;
  chapterId: string;
}

const Chapter: React.FC<IProps> = (props: IProps) => {
  const { bookId, chapterId } = props;
  const [loading, setLoading] = useState(false);
  const [chapter, setChapter] = useState<IChapter>();
  const router = useRouter();
  const [book, setBook] = useState<IBook>();
  const [index, setIndex] = useState(0);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user._id);
  const user = useAppSelector((state) => state.auth.user);
  const books = useAppSelector((state) => state.auth.user?.books || []);
  const isFollowing = books?.includes(book?._id as any);
  const [isBought, setIsBought] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await getBookById(bookId, "all", "-1");
      if (res.code === 200) {
        setBook(res.data);
        const chapters = res.data?.chapters || [];
        const currentChapter = chapters.find(
          (chapter) => chapter._id === chapterId
        );
        if (currentChapter) {
          setChapter(currentChapter);

          // Logic kiểm tra mua chương và hiện modal
          if (currentChapter.status === "lock") {
            if (
              userId &&
              currentChapter.users &&
              Array.isArray(currentChapter.users) &&
              currentChapter.users.includes(userId)
            ) {
              setIsBought(true);
              setOpen(false);
            } else if (userId) {
              setIsBought(false);
              setOpen(true);
            } else {
              setIsBought(false);
              setOpen(false);
            }
          } else {
            setIsBought(true);
            setOpen(false);
          }

          // Xử lý cập nhật viewsHistory
          if (currentChapter && typeof currentChapter.views === "number") {
            const todayStr = new Date().toISOString().slice(0, 10);
            type ViewHistoryItem = { date: string | Date; views: number };
            const viewsHistory: ViewHistoryItem[] = Array.isArray(
              currentChapter.viewsHistory
            )
              ? currentChapter.viewsHistory.map(({ date, views }) => ({
                  date,
                  views,
                }))
              : [];
            const todayHistory = viewsHistory.find(
              (v: ViewHistoryItem) =>
                v.date &&
                (typeof v.date === "string"
                  ? v.date.slice(0, 10) === todayStr
                  : new Date(v.date).toISOString().slice(0, 10) === todayStr)
            );
            if (todayHistory) {
              todayHistory.views += 1;
            } else {
              viewsHistory.push({ date: new Date(), views: 1 });
            }

            await updateChapter({
              _id: currentChapter._id,
              views: currentChapter.views + 1,
              viewsHistory: viewsHistory as any,
            });

            setChapter({
              ...currentChapter,
              views: currentChapter.views + 1,
              viewsHistory: viewsHistory as any,
            });
          }

          const currentIndex = chapters.findIndex(
            (chapter) => chapter._id === chapterId
          );
          setIndex(currentIndex);
        } else {
          console.error(
            "Chương không tồn tại trong danh sách chương của sách."
          );
        }
      } else {
        console.error("Lỗi khi lấy sách", res.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sách", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (direction: string, chapterNumber = "") => {
    if (direction === "next") {
      const nextChapter = book?.chapters?.at(index + 1);
      if (nextChapter) {
        router.push(`/book/${bookId}/chapter/${nextChapter._id}`);
      }
    } else if (direction === "prev") {
      const prevChapter = book?.chapters?.at(index - 1);
      if (prevChapter) {
        router.push(`/book/${bookId}/chapter/${prevChapter._id}`);
      }
    } else if (direction === "home") {
      router.push("/");
    } else if (direction === "menu") {
      router.push(`/book/${bookId}?limit=all`);
    } else if (direction === "reload") {
      router.refresh();
    } else if (direction === "chapter") {
      const chapter = book?.chapters?.find(
        (chapter) => chapter.chapterNumber === chapterNumber
      );
      router.push(`/book/${bookId}/chapter/${chapter?._id}`);
    }
  };

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
        if (isFollowing) {
          console.log("Đã bỏ theo dõi sách");
        } else {
          console.log("Đã theo dõi sách");
        }
      } else {
        console.error("Lỗi khi xử lý theo dõi", res.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu theo dõi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const res = await buyChapter(userId, chapterId);
      if (res.code === 201) {
        toast.success("Mua chương thành công!");
        setIsBought(true);
        setOpen(false);
        fetchBook();
        dispatch(fetchAccount());
      } else {
        toast.error(res.message || "Mua chương thất bại!");
      }
    } catch (error) {
      console.error("Error handling OK button click", error);
      toast.error("Có lỗi xảy ra khi mua chương!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    router.back();
  };

  useEffect(() => {
    fetchBook();
    if (userId && bookId && chapterId) {
      try {
        saveReadingHistory(userId, bookId, chapterId);
        console.log("Lưu lịch sử đọc thành công");
      } catch (error) {
        console.error("Lỗi khi lưu lịch sử đọc", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapterId]);

  if (loading) {
    return <LoadingSpin />;
  }
  return (
    <div className={styles.chapterContainer}>
      <div className={styles.chapterHeader}>
        {/* Navigation Section */}
        <div className={styles.navigation}>
          <button
            className={styles.icon}
            onClick={() => handleNavigation("home")}
          >
            <HomeFilled />
          </button>
          <button
            className={styles.icon}
            onClick={() => handleNavigation("menu")}
          >
            <MenuOutlined />
          </button>
          <button
            className={styles.icon}
            onClick={() => handleNavigation("reload")}
          >
            <ReloadOutlined />
          </button>
          {index > 0 && (
            <button
              className={styles.navButton}
              onClick={() => handleNavigation("prev")}
            >
              <ArrowLeftOutlined style={{ color: "#fff" }} />
            </button>
          )}
        </div>

        {/* Chapter Info */}
        <div className={styles.chapterInfo}>
          <select
            className={styles.chapterSelect}
            value={chapter?.chapterNumber}
            onChange={(e) => handleNavigation("chapter", e.target.value)}
          >
            {book?.chapters?.map((chapter) => (
              <option key={chapter._id} value={chapter.chapterNumber}>
                {chapter.chapterNumber}: {chapter.chapterTitle}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.navigation}>
          {book?.chapters && index < book.chapters.length - 1 && (
            <button
              className={styles.navButton}
              onClick={() => handleNavigation("next")}
            >
              <ArrowRightOutlined style={{ color: "#fff" }} />
            </button>
          )}
        </div>

        {/* Follow Button */}
        {isFollowing ? (
          <button
            className={styles.followButton}
            onClick={handleFollow}
            style={{ backgroundColor: "#f7444e" }}
          >
            <HeartOutlined />
            Bỏ theo dõi
          </button>
        ) : (
          <button className={styles.followButton} onClick={handleFollow}>
            <HeartOutlined />
            Theo dõi
          </button>
        )}
      </div>

      {/* Chapter Content */}
      <div className={styles.chapterContent}>
        {chapter?.status === "unlock" || isBought ? (
          Array.isArray(chapter?.images) &&
          chapter.images[0].length > 0 &&
          chapter.images[0]?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Chapter Content ${index + 1}`}
              className={styles.chapterImage}
            />
          ))
        ) : chapter?.status === "lock" && !user._id ? (
          <div className={styles.loginNotice}>
            <p>
              Bạn cần{" "}
              <a
                href="/login"
                style={{ color: "#f7444e", textDecoration: "underline" }}
              >
                đăng nhập
              </a>{" "}
              để mua và đọc chương này.
            </p>
          </div>
        ) : null}
      </div>

      <div className={styles.chapterHeader}>
        {/* Navigation Section */}
        <div className={styles.navigation}>
          <button
            className={styles.icon}
            onClick={() => handleNavigation("home")}
          >
            <HomeFilled />
          </button>
          <button
            className={styles.icon}
            onClick={() => handleNavigation("menu")}
          >
            <MenuOutlined />
          </button>
          <button
            className={styles.icon}
            onClick={() => handleNavigation("reload")}
          >
            <ReloadOutlined />
          </button>
          {index > 0 && (
            <button
              className={styles.navButton}
              onClick={() => handleNavigation("prev")}
            >
              <ArrowLeftOutlined style={{ color: "#fff" }} />
            </button>
          )}
        </div>

        {/* Chapter Info */}
        <div className={styles.chapterInfo}>
          <select
            className={styles.chapterSelect}
            value={chapter?.chapterNumber}
            onChange={(e) => handleNavigation("chapter", e.target.value)}
          >
            {book?.chapters
              ?.map((chapter) => (
                <option key={chapter._id} value={chapter.chapterNumber}>
                  {chapter.chapterNumber}: {chapter.chapterTitle}
                </option>
              ))
              .reverse()}
          </select>
        </div>

        <div className={styles.navigation}>
          {book?.chapters && index < book.chapters.length - 1 && (
            <button
              className={styles.navButton}
              onClick={() => handleNavigation("next")}
            >
              <ArrowRightOutlined style={{ color: "#fff" }} />
            </button>
          )}
        </div>

        {/* Follow Button */}
        {isFollowing ? (
          <button
            className={styles.followButton}
            onClick={handleFollow}
            style={{ backgroundColor: "#f7444e" }}
          >
            <HeartOutlined />
            Bỏ theo dõi
          </button>
        ) : (
          <button className={styles.followButton} onClick={handleFollow}>
            <HeartOutlined />
            Theo dõi
          </button>
        )}
      </div>
      <Modal
        title="Mua chương truyện"
        open={open && !isBought && !!userId && chapter?.status === "lock"}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Mua chương"
        cancelText="Hủy"
      >
        <p>
          Bạn cần mua chương này với {chapter?.price} để đọc nội dung. Bạn có
          muốn mua không?
        </p>
      </Modal>
    </div>
  );
};

export default Chapter;
