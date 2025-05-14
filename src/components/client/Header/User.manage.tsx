import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  Table,
  Tabs,
  message,
  notification,
} from "antd";
import { isMobile } from "react-device-detect";
import { Result, TabsProps } from "antd";
// import { IResume, ISkill, ISubscribers } from "@/types/backend";
import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
// import {
//   createSubscriber,
//   fetchResumeByUser,
//   fetchSkills,
//   updateUserPassword,
// } from "@/config/api";
import { SmileOutlined } from "@ant-design/icons";
import { FormProps } from "antd/lib";
import { useAppSelector } from "@/lib/redux/hooks";
import { ITranslatorGroup } from "@/types/backend";
import { getGroupsByUser } from "@/config/api";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/router";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

interface FieldType {
  password: string;
  newPassword: string;
  repeatedPassword: string;
}

const UpdateUserPassword = (props: any) => {
  //   const userId = useAppSelector((state) => state.auth.user?._id);
  //   const [loading, setLoading] = useState(false);
  //   const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  //     const { password, newPassword, repeatedPassword } = values;

  //     if (newPassword.length < 6) {
  //       message.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
  //       return;
  //     }

  //     if (newPassword !== repeatedPassword) {
  //       message.error("Mật khẩu nhập lại không khớp!");
  //       return;
  //     }
  //     setLoading(true);
  //     const res = await updateUserPassword(userId, values);
  //     if (res.code === 200) {
  //       setLoading(false);
  //       message.success("Thay đổi mật khẩu thành công!");
  //     } else {
  //       notification.error({
  //         message: "Thay đổi mật khẩu thất bại",
  //         description: res.message,
  //       });
  //       setLoading(false);
  //     }
  //   };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        Thay đổi mật khẩu
      </h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 700, margin: "0 auto" }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Nhập mật khẩu cũ"
          name="password"
          rules={[
            { required: true, message: "Trường này không được để trống!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Nhập mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Trường này không được để trống!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="repeatedPassword"
          label="Nhập lại mật khẩu mới"
          rules={[
            { required: true, message: "Trường này không được để trống!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          {/* <Button loading={loading} type="primary" htmlType="submit">
            Xác nhận
          </Button> */}
        </Form.Item>
      </Form>
    </>
  );
};

const UserGroups: React.FC = () => {
  const [groups, setGroups] = useState<ITranslatorGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await getGroupsByUser({ current: 1, pageSize: 10 });
      if (res.code === 200) {
        setGroups(res.data?.result as ITranslatorGroup[]);
      } else {
        toast.error("Không thể tải danh sách nhóm dịch");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleClick = (group: ITranslatorGroup) => {
    if (group.groupStatus === "inactive") {
      toast.error("Nhóm dịch chưa được duyệt!");
      return;
    }

    window.location.href = `/translator/${group._id}`;
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Nhóm dịch đang tham gia
      </Title>
      {groups.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Title style={{ opacity: 0.7 }} level={5}>
            Bạn chưa tham gia nhóm dịch nào
          </Title>
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="start">
          {groups.map((group) => (
            <Col
              onClick={() => handleClick(group)}
              key={group._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
            >
              <Card
                hoverable
                style={{
                  border: "1px solid #d9d9d9", // Thêm border
                }}
                cover={
                  <img
                    alt={group.groupName}
                    src={group.groupImgUrl}
                    style={{ height: 150, objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <div>
                      <strong>Tên nhóm dịch:</strong> {group.groupName}
                    </div>
                  }
                  description={
                    <div>
                      <div>
                        <strong>Mô tả:</strong> {group.groupDescription}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {group.groupStatus === "active" ? (
                          <>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: "green",
                                marginRight: 8,
                              }}
                            ></div>
                            <span style={{ color: "green" }}>
                              Đang hoạt động
                            </span>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: "red",
                                marginRight: 8,
                              }}
                            ></div>
                            <span style={{ color: "red" }}>
                              Chưa được duyệt
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

const ManageUser = (props: IProps) => {
  const { open, setOpen } = props;

  const items: TabsProps["items"] = [
    {
      key: "user-password",
      label: `Thay đổi mật khẩu`,
      children: <UpdateUserPassword />,
    },
    {
      key: "user-groups",
      label: `Nhóm dịch đang tham gia`,
      children: <UserGroups />,
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={open}
        onCancel={() => setOpen(false)}
        maskClosable={false}
        footer={null}
        destroyOnClose={true}
        width={isMobile ? "100%" : "1400px"}
      >
        <div style={{ minHeight: 400 }}>
          <Tabs defaultActiveKey="user-resume" items={items} />
        </div>
      </Modal>
    </>
  );
};

export default ManageUser;
