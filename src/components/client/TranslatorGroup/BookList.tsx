"use client";

import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Card, Input } from "antd";
import EditBookModal from "@/components/client/TranslatorGroup/EditBookModal";
import EditChapterModal from "@/components/client/TranslatorGroup/EditChapterModal";
import { getBookById, getGroupById } from "@/config/api";
import { IBook, ITranslatorGroup } from "@/types/backend";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import AddBookModal from "@/components/client/TranslatorGroup/AddBookModal";
import LoadingSpin from "@/components/client/Spin/LoadingSpin";

const { Meta } = Card;

const BookList: React.FC = () => {
  const { translatorGroupId } = useParams();

  const [books, setBooks] = useState<IBook[]>([]); // State để lưu danh sách sách
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải dữ liệu
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAddBook, setOpenAddBook] = useState(false);
  const [searchTitle, setSearchTitle] = useState(""); // State để lưu giá trị tìm kiếm
  const [group, setGroup] = useState<ITranslatorGroup | null>(null); // State để lưu thông tin nhóm
  const [book, setBook] = useState<IBook | null>(null); // State để lưu thông tin sách

  // Hàm fetch thông tin nhóm
  const fetchGroup = async (groupId: string) => {
    try {
      setLoading(true); // Bắt đầu tải dữ liệu
      if (!groupId) {
        toast.error("Không tìm thấy groupId");
        return;
      }

      const res = await getGroupById(groupId); // Gọi API lấy thông tin nhóm
      if (res.code === 200) {
        const groupData = res.data; // Lấy thông tin nhóm từ API
        setGroup(groupData as any); // Lưu thông tin nhóm vào state
        // console.log("Group data:", groupData);

        // Lấy thông tin chi tiết của từng sách
        const bookDetails = await Promise.all(
          (groupData?.books ?? []).map(async (bookId: string) => {
            try {
              const bookRes = await getBookById(bookId); // Gọi API lấy thông tin sách
              if (bookRes.code === 200) {
                return bookRes.data;
              } else {
                console.error(`Không thể tải thông tin sách với ID: ${bookId}`);
                return null;
              }
            } catch (error) {
              console.error(
                `Lỗi khi tải thông tin sách với ID: ${bookId}`,
                error
              );
              return null;
            }
          })
        );

        // Lọc bỏ các sách không hợp lệ (null)
        setBooks(bookDetails.filter((book) => book !== null) as IBook[]);
      } else {
        toast.error("Không thể tải thông tin nhóm");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhóm:", error);
      toast.error("Đã xảy ra lỗi khi tải thông tin nhóm");
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu
    }
  };

  useEffect(() => {
    if (translatorGroupId) {
      fetchGroup(translatorGroupId as any); // Gọi hàm fetchGroup với groupId
    }
  }, [translatorGroupId]);

  // Hàm tìm kiếm sách
  const handleSearch = () => {
    if (!searchTitle.trim()) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    const filteredBooks = books.filter((book) =>
      book.bookTitle.toLowerCase().includes(searchTitle.toLowerCase())
    );
    setBooks(filteredBooks);
  };

  // Hàm làm mới danh sách sách
  const handleRefresh = () => {
    setSearchTitle("");
    if (group) {
      fetchGroup(group._id as any); // Làm mới danh sách sách từ nhóm
    }
  };

  const showModal = (book: IBook) => {
    setBook(book);
    setOpen(true);
  };

  const showEditModal = (book: IBook) => {
    setBook(book);
    setOpenEdit(true);
  };

  const updateBookInList = (updatedBook: IBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === updatedBook._id ? updatedBook : book
      )
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      {loading ? (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <LoadingSpin />
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {group?.groupName || "Danh sách truyện"}
            </h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <Input
                placeholder="Tìm kiếm theo tên"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                style={{ width: "200px" }}
              />
              <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button onClick={() => setOpenAddBook(true)}>Thêm sách</Button>
              <Button onClick={handleRefresh}>Làm mới</Button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {books.map((book) => (
              <React.Fragment key={book._id}>
                <Card
                  style={{ width: 170, height: 250 }}
                  cover={
                    <img
                      alt={book.bookTitle}
                      src={book.imgUrl || "/default-image.png"}
                      style={{ height: 250, width: 170, objectFit: "cover" }}
                    />
                  }
                  actions={[
                    <SettingOutlined
                      key="setting"
                      onClick={() => showEditModal(book)}
                    />,
                    <EditOutlined key="edit" onClick={() => showModal(book)} />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]}
                >
                  <Meta title={book.bookTitle} />
                </Card>
              </React.Fragment>
            ))}
          </div>
          <AddBookModal
            open={openAddBook}
            setOpen={setOpenAddBook}
            refresh={handleRefresh}
          />
          <EditBookModal
            open={open}
            setOpen={setOpen}
            book={book}
            updateBookInList={updateBookInList}
          />
          <EditChapterModal
            open={openEdit}
            setOpen={setOpenEdit}
            book={book}
            updateBookInList={updateBookInList}
            setBook={setBook}
          />
        </div>
      )}
    </div>
  );
};

export default BookList;
