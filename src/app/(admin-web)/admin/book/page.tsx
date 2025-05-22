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
  Image,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { IBook } from "@/types/backend";
import dayjs from "dayjs";
import {
  createBook,
  createUser,
  deleteBook,
  deleteUser,
  getBooks,
  getUsers,
  updateBook,
  updateUser,
} from "@/config/api";
import { toast } from "react-toastify";

const ManageUserPage: React.FC = () => {
  const [data, setData] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 0,
  });
  const [searchName, setSearchName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<IBook | null>(null);
  const [form] = Form.useForm();

  const fetchBooks = async (current = 1, pageSize = 10, name = "") => {
    setLoading(true);
    try {
      const res = await getBooks({ current, pageSize, bookTitle: name });
      if (res.code === 200) {
        setData(res?.data?.result as IBook[]);
        setPagination(res.data?.meta as any);
      } else {
        toast.error("Không thể tải danh sách books");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks(1, pagination.pageSize, searchName);
  };

  const handleRefresh = () => {
    setSearchName("");
    fetchBooks(1, pagination.pageSize);
  };

  const handleTableChange = (pagination: any) => {
    fetchBooks(pagination.current, pagination.pageSize, searchName);
  };

  const handleUpdate = (book: IBook) => {
    setIsUpdateMode(true);
    setCurrentUser(book);
    form.setFieldsValue(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId);

      toast.success("Xóa sách thành công!");
      fetchBooks(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa sách");
    }
  };

  const handleCreateOrUpdateUser = async (values: IBook) => {
    try {
      if (isUpdateMode) {
        const dataUser = {
          ...values,
          _id: currentUser?._id,
        };
        const res = await updateBook(dataUser);
        if (res.code !== 200) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : res.message.join(", ")
          );
          return;
        }
        toast.success("Cập nhật book thành công!");
      } else {
        const res = await createBook(
          values,
          values?.translatorGroup?._id as string
        );
        if (res.code !== 201) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : res.message.join(", ")
          );
          return;
        }

        toast.success("Tạo mới book thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchBooks();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xử lý book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const columns: ColumnsType<IBook> = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên",
      dataIndex: "bookTitle",
      sorter: (a, b) => a.bookTitle.localeCompare(b.bookTitle),
      key: "bookTitle",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Bìa sách",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl: string) => (
        <Image
          src={imgUrl}
          width={100}
          height={100}
          alt="Bìa sách"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sách này?"
            onConfirm={() => handleDelete(record._id!)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Quản lý Books</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            placeholder="Tìm kiếm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: "200px" }}
          />
          <Button
            style={{ marginRight: "100px" }}
            type="primary"
            onClick={handleSearch}
          >
            Tìm kiếm
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
    </div>
  );
};

export default ManageUserPage;
