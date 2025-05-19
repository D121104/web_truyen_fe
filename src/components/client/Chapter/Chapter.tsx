import LoadingSpin from "@/components/client/Spin/LoadingSpin";
import {
  getBookById,
  getChapterById,
  saveReadingHistory,
  updateChapter,
} from "@/config/api";
import { useAppSelector } from "@/lib/redux/hooks";
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface IProps {
  bookId: string;
  chapterId: string;
}

const Chapter: React.FC<IProps> = (props: IProps) => {
  const { bookId, chapterId } = props;
  const [loading, setLoading] = useState(false);
  const [chapter, setChapter] = useState<IChapter>(null);
  const router = useRouter();
  const [book, setBook] = useState<IBook>(null);
  const [index, setIndex] = useState(0);
  const userId = useAppSelector((state) => state.auth.user._id);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await getBookById(bookId, "all", "-1");
      if (res.code === 200) {
        setBook(res.data);
        const chapters = res.data.chapters || [];
        const currentChapter = chapters.find(
          (chapter) => chapter._id === chapterId
        );
        if (currentChapter) {
          setChapter(currentChapter);
          console.log("chapter in saveReadingHistory", chapter);
          if (currentChapter && typeof currentChapter.views === "number") {
            // Xử lý cập nhật viewsHistory
            const todayStr = new Date().toISOString().slice(0, 10);
            const viewsHistory = Array.isArray(currentChapter.viewsHistory)
              ? currentChapter.viewsHistory.map(({ date, views }) => ({
                  date,
                  views,
                }))
              : [];
            const todayHistory = viewsHistory.find(
              (v) =>
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
              viewsHistory,
            });

            setChapter({
              ...currentChapter,
              views: currentChapter.views + 1,
              viewsHistory,
            });
          }
          console.log("currentChapter", currentChapter);
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
      // Handle next chapter navigation
      const nextChapter = book?.chapters?.at(index + 1);

      if (nextChapter) {
        router.push(`/book/${bookId}/chapter/${nextChapter._id}`);
      }
    } else if (direction === "prev") {
      // Handle previous chapter navigation
      const prevChapter = book?.chapters?.at(index - 1);

      if (prevChapter) {
        router.push(`/book/${bookId}/chapter/${prevChapter._id}`);
      }
    } else if (direction === "home") {
      // Handle home navigation
      router.push("/");
    } else if (direction === "menu") {
      // Handle menu navigation
      router.push(`/book/${bookId}?limit=all`);
    } else if (direction === "reload") {
      // Handle reload navigation
      router.refresh();
    } else if (direction === "chapter") {
      const chapter = book?.chapters?.find(
        (chapter) => chapter.chapterNumber === chapterNumber
      );

      // Handle chapter navigation
      router.push(`/book/${bookId}/chapter/${chapter?._id}`);
    }
  };

  useEffect(() => {
    // fetchChapter();
    fetchBook();
    if (userId && bookId && chapterId) {
      try {
        saveReadingHistory(userId, bookId, chapterId);

        console.log("Lưu lịch sử đọc thành công");
      } catch (error) {
        console.error("Lỗi khi lưu lịch sử đọc", error);
      }
    }
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
          {index < book?.chapters?.length - 1 && (
            <button
              className={styles.navButton}
              onClick={() => handleNavigation("next")}
            >
              <ArrowRightOutlined style={{ color: "#fff" }} />
            </button>
          )}
        </div>

        {/* Follow Button */}
        <button className={styles.followButton}>
          <HeartOutlined />
          Theo dõi
        </button>
      </div>

      {/* Chapter Content */}
      <div className={styles.chapterContent}>
        {chapter?.images?.length > 0 &&
          chapter?.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Chapter Content ${index + 1}`}
              className={styles.chapterImage}
            />
          ))}
      </div>
    </div>
  );
};

export default Chapter;
