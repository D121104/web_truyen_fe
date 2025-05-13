"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Upload, Image } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "@/styles/TranslatorGroup.module.scss";
import classNames from "classnames";
import UploadImg from "@/components/client/Upload/Upload";
import { createGroup } from "@/config/api";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const RegisterGroup: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const res = await createGroup(values);

    if (res.code === 201) {
      form.resetFields();
      setLoading(false);
      toast.success("Tạo yêu cầu thành công, vui lòng chờ admin duyệt");
      return;
    }

    toast.error(res.message.join(", "));
    setLoading(false);
  };
  return (
    <div
      className={cx("container")}
      style={{
        width: "500px",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        marginTop: "50px",
        border: "1px solid #3aafa9",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <Form
        layout={"vertical"}
        form={form}
        size="large"
        name=""
        onFinish={handleSubmit}
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ marginLeft: "125px" }}>Đăng ký nhóm dịch</h1>
        <Form.Item
          label="Tên nhóm dịch"
          rules={[{ required: true, message: "Vui lòng nhập tên nhóm dịch" }]}
          name="groupName"
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          label="Mô tả"
          name="groupDescription"
        >
          <Input.TextArea placeholder="" />
        </Form.Item>
        <Form.Item label="Ảnh nhóm dịch" name="groupImgUrl">
          <UploadImg
            onUploadSuccess={(url: string) => {
              form.setFieldsValue({ groupImgUrl: url });
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              margin: "0 auto",
              justifyContent: "center",
              width: "100px",
              marginLeft: "200px",
            }}
          >
            Tạo nhóm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterGroup;
