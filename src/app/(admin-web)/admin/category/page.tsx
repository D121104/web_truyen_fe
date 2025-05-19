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
  Popconfirm,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { ICategory } from "@/types/backend";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/config/api";
import { toast } from "react-toastify";

const Category: React.FC = () => {
  const [data, setData] = useState<ICategory[]>([]);
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
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchCategories = async (
    current = 1,
    pageSize = 10,
    categoryName = ""
  ) => {
    setLoading(true);
    try {
      console.log(pageSize);
      const res = await getCategories({ current, pageSize, categoryName });
      console.log("res", res?.data?.result);
      if (res.code === 200) {
        setData(res?.data?.result as ICategory[]);
        setPagination(res.data?.meta as any);
      } else {
        toast.error("Không thể tải danh sách thể loại");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCategories(1, pagination.pageSize, searchName);
  };

  const handleRefresh = () => {
    console.log(pagination.pageSize);
    setSearchName("");
    fetchCategories(1, pagination.pageSize || 10);
  };

  const handleTableChange = (pagination: any) => {
    fetchCategories(pagination.current, pagination.pageSize, searchName);
  };

  const handleUpdate = (category: ICategory) => {
    setIsUpdateMode(true);
    setCurrentCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast.success("Xóa thể loại thành công!");
      fetchCategories(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa thể loại");
    }
  };

  const handleCreateOrUpdateCategory = async (values: ICategory) => {
    try {
      if (isUpdateMode) {
        const dataCategory = {
          ...values,
          _id: currentCategory?._id,
        };
        const res = await updateCategory(dataCategory);
        if (res.code !== 200) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : res.message.join(", ")
          );
          return;
        }
        toast.success("Cập nhật thể loại thành công!");
      } else {
        const res = await createCategory(values);
        if (res.code !== 201) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : res.message.join(", ")
          );
          return;
        }
        toast.success("Tạo mới thể loại thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xử lý thể loại");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns: ColumnsType<ICategory> = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên thể loại",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
            title="Bạn có chắc chắn muốn xóa thể loại này?"
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
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Quản lý thể loại
        </h1>
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
          <Button
            type="primary"
            onClick={() => {
              setIsUpdateMode(false);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Tạo mới thể loại
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
        title={isUpdateMode ? "Cập nhật thể loại" : "Tạo mới thể loại"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isUpdateMode ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdateCategory}
        >
          <Form.Item
            label="Tên thể loại"
            name="categoryName"
            rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
