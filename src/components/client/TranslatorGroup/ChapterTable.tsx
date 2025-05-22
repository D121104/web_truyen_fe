"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Modal,
  Form,
  Select,
  Popconfirm,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { IBook, IChapter } from "@/types/backend";
import dayjs from "dayjs";
import {
  createChapter,
  updateChapter,
  deleteChapter,
  getBookById,
} from "@/config/api";
import { toast } from "react-toastify";
import UploadImgs from "@/components/client/Upload/UploadImgs";

interface IProps {
  book: IBook | null;
  setBook: (book: IBook | null) => void;
}

const ChapterTable: React.FC<IProps> = (props: IProps) => {
  const { book, setBook } = props;
  const [data, setData] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 0,
  });
  const [searchName, setSearchName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<IChapter | null>(null);
  const [form] = Form.useForm();

  // Lấy danh sách chương (phân trang và sắp xếp)
  const fetchChapters = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      if (!book || !book.chapters || book.chapters.length === 0) {
        setData([]);
        setPagination({ current: 1, pageSize: 10, total: 0, pages: 0 });
        return;
      }

      // Sắp xếp chương theo số chương
      const sortedChapters = [...book.chapters].sort(
        (a, b) => Number(a.chapterNumber) - Number(b.chapterNumber)
      );

      // Phân trang dữ liệu
      const startIndex = (current - 1) * pageSize;
      const paginatedChapters = sortedChapters.slice(
        startIndex,
        startIndex + pageSize
      );

      setData(paginatedChapters);
      setPagination({
        current,
        pageSize,
        total: sortedChapters.length,
        pages: Math.ceil(sortedChapters.length / pageSize),
      });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu chương");
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm chương
  const handleSearch = () => {
    if (!searchName.trim()) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    const filteredChapters = (book?.chapters ?? []).filter((chapter) =>
      chapter.chapterNumber
        .toString()
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );
    setData(filteredChapters);
  };

  // Làm mới danh sách chương
  const handleRefresh = () => {
    setSearchName("");
    fetchChapters(1, pagination.pageSize);
  };

  // Thay đổi phân trang
  const handleTableChange = (pagination: any) => {
    fetchChapters(pagination.current, pagination.pageSize);
  };

  // Cập nhật chương
  const handleUpdate = (chapter: IChapter) => {
    setIsUpdateMode(true);
    setCurrentChapter(chapter);
    form.setFieldsValue(chapter);
    setIsModalOpen(true);
  };

  // Xóa chương
  const handleDelete = async (chapterId: string) => {
    try {
      await deleteChapter(chapterId, book?._id as string);
      // Lấy lại book mới nhất từ backend để đồng bộ dữ liệu
      if (book?._id) {
        const refreshedBook = await getBookById(book._id);
        setBook(refreshedBook.data as IBook);
      }
      toast.success("Xóa chương thành công!");
      fetchChapters(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa chương");
    }
  };

  // Thêm hoặc cập nhật chương
  const handleCreateOrUpdateChapter = async (values: IChapter) => {
    try {
      if (isUpdateMode) {
        const updatedChapter = { ...values, _id: currentChapter?._id };
        const res = await updateChapter(updatedChapter);
        if (res.code !== 200) {
          toast.error(res.message || "Cập nhật chương thất bại");
          return;
        }
        toast.success("Cập nhật chương thành công!");
      } else {
        const res = await createChapter(values, book?._id);
        if (res.code === 201) {
          toast.success("Tạo chương mới thành công!");
        } else {
          toast.error(res.message || "Tạo chương mới thất bại");
          return;
        }
      }
      // Lấy lại book mới nhất từ backend để đồng bộ dữ liệu
      if (book?._id) {
        const refreshedBook = await getBookById(book._id);
        setBook(refreshedBook.data as IBook);
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchChapters(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xử lý chương: " + error);
    }
  };

  useEffect(() => {
    if (book) {
      fetchChapters(1, pagination.pageSize);
    }
    // eslint-disable-next-line
  }, [book]);

  const columns: ColumnsType<IChapter> = [
    {
      title: "Chương",
      dataIndex: "chapterNumber",
      key: "chapterNumber",
    },
    {
      title: "Tiêu đề",
      dataIndex: "chapterTitle",
      key: "chapterTitle",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chương này?"
            onConfirm={() => handleDelete(record._id!)}
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", width: "90%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Danh sách chương
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            placeholder="Tìm kiếm theo chương"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: "200px" }}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsUpdateMode(false);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm chương mới
          </Button>
          <Button onClick={handleRefresh}>Làm mới</Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        rowKey={(record) => record._id || "default-key"}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={isUpdateMode ? "Cập nhật chương" : "Tạo mới chương"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isUpdateMode ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdateChapter}
        >
          <Form.Item
            label="Chương"
            name="chapterNumber"
            rules={[{ required: true, message: "Vui lòng nhập số chương" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tiêu đề"
            name="chapterTitle"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="lock">Khóa</Select.Option>
              <Select.Option value="unlock">Mở khóa</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Nội dung chương" name="images">
            <UploadImgs
              onUploadSuccess={(url: string) => {
                return form.setFieldsValue({ images: [url] });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChapterTable;
