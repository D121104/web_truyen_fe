"use client";

import { getGroups, updateGroup } from "@/config/api";
import { ITranslatorGroup } from "@/types/backend";
import { Button, Image, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { Table } from "antd/lib";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TranslatorGroup = () => {
  const [data, setData] = useState<ITranslatorGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchGroups = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getGroups({ current, pageSize });
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

  const handleConfirm = async (record: ITranslatorGroup) => {
    const updatedRecord = {
      _id: record._id,
      groupStatus: "active",
    };

    try {
      await updateGroup(updatedRecord);
      toast.success("Xác nhận nhóm dịch thành công");
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
          title="Bạn có chắc chắn muốn xác nhận nhóm dịch này?"
          onConfirm={() => handleConfirm(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Xác nhận</Button>
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
        <Button type="default" onClick={() => fetchGroups()}>
          Làm mới
        </Button>
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
