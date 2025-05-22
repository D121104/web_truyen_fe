"use client";

import { getGroups, updateGroup } from "@/config/api";
import { ITranslatorGroup } from "@/types/backend";
import { Button, Image, Popconfirm, Select, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { Table } from "antd/lib";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TranslatorGroup = () => {
  const [data, setData] = useState<ITranslatorGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const fetchGroups = async (
    current = 1,
    pageSize = 10,
    groupStatus?: string
  ) => {
    setLoading(true);
    try {
      const params: any = { current, pageSize };
      if (groupStatus) params.groupStatus = groupStatus;
      const res = await getGroups(params);
      if (res.code === 200) {
        setData(res.data?.result as ITranslatorGroup[]);
        setPagination(res.data?.meta as any);
      } else {
        toast.error("Không thể tải danh sách nhóm dịch");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    fetchGroups(1, 10, value);
  };

  const handleConfirm = async (record: ITranslatorGroup) => {
    const updatedRecord = {
      _id: record._id,
      groupStatus: record.groupStatus === "active" ? "inactive" : "active",
    };

    try {
      await updateGroup(updatedRecord);
      record.groupStatus === "active"
        ? toast.success("Hủy xác nhận nhóm dịch thành công")
        : toast.success("Xác nhận nhóm dịch thành công");
      await fetchGroups();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xác nhận nhóm dịch");
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchGroups(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const columns: ColumnsType<ITranslatorGroup> = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên nhóm dịch",
      dataIndex: "groupName",
      sorter: (a, b) => (a.groupName?.length ?? 0) - (b.groupName?.length ?? 0),
      key: "groupName",
    },
    {
      title: "Mô tả",
      dataIndex: "groupDescription",
      sorter: (a, b) =>
        (a.groupDescription?.length ?? 0) - (b.groupDescription?.length ?? 0),
      key: "groupDescription",
    },
    {
      title: "Trạng thái",
      dataIndex: "groupStatus",
      key: "groupStatus",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Ảnh nhóm dịch",
      dataIndex: "groupImgUrl",
      key: "groupImgUrl",
      sorter: (a, b) =>
        (a.groupImgUrl?.length ?? 0) - (b.groupImgUrl?.length ?? 0),
      render: (url: string) => (
        <Image src={url} alt="Group Image" width={140} height={140} />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title={
            record.groupStatus?.toLowerCase() === "active"
              ? "Bạn có chắc muốn hủy xác nhận nhóm dịch này?"
              : "Bạn có chắc chắn muốn xác nhận nhóm dịch này?"
          }
          onConfirm={() => handleConfirm(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger={record.groupStatus === "active"}>
            {record.groupStatus === "active" ? "Hủy xác nhận" : "Xác nhận"}
          </Button>
        </Popconfirm>
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
        }}
      >
        <Title level={2}>Quản lý nhóm dịch</Title>
        <div style={{ display: "flex", gap: 12 }}>
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={handleStatusChange}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Button type="default" onClick={() => fetchGroups()}>
            Làm mới
          </Button>
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

export default TranslatorGroup;
