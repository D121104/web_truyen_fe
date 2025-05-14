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
import { IUser } from "@/types/backend";
import dayjs from "dayjs";
import { createUser, deleteUser, getUsers, updateUser } from "@/config/api";
import { toast } from "react-toastify";

const ManageUserPage: React.FC = () => {
  const [data, setData] = useState<IUser[]>([]);
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
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async (current = 1, pageSize = 10, name = "") => {
    setLoading(true);
    try {
      const res = await getUsers({ current, pageSize, name });
      if (res.code === 200) {
        setData(res?.data?.result as IUser[]);
        setPagination(res.data?.meta as any);
      } else {
        toast.error("Không thể tải danh sách người dùng");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(1, pagination.pageSize, searchName);
  };

  const handleRefresh = () => {
    setSearchName("");
    fetchUsers(1, pagination.pageSize);
  };

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize, searchName);
  };

  const handleUpdate = (user: IUser) => {
    setIsUpdateMode(true);
    setCurrentUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);

      toast.success("Xóa người dùng thành công!");
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa người dùng");
    }
  };

  const handleCreateOrUpdateUser = async (values: IUser) => {
    try {
      if (isUpdateMode) {
        const dataUser = {
          ...values,
          _id: currentUser?._id,
        };
        const res = await updateUser(dataUser);
        if (res.code !== 200) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : res.message.join(", ")
          );
          return;
        }
        toast.success("Cập nhật user thành công!");
      } else {
        const res = await createUser(values);
        if (res.code !== 201) {
          toast.error(
            typeof res.message === "string"
              ? res.message
              : res.message.join(", ")
          );
          return;
        }

        toast.success("Tạo mới user thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xử lý user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: ColumnsType<IUser> = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Coin",
      dataIndex: "coin",
      key: "coin",
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
            Update
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
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
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Quản lý Users</h1>
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
            Tạo mới user
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
        title={isUpdateMode ? "Cập nhật User" : "Tạo mới User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={isUpdateMode ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdateUser}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: !isUpdateMode, message: "Vui lòng nhập mật khẩu" },
            ]}
          >
            <Input.Password disabled={isUpdateMode} />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUserPage;
