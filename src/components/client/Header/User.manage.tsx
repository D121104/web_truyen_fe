import {
  Button,
  Form,
  Input,
  Modal,
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

const ManageUser = (props: IProps) => {
  const { open, setOpen } = props;

  const items: TabsProps["items"] = [
    {
      key: "user-password",
      label: `Thay đổi mật khẩu`,
      children: <UpdateUserPassword />,
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
