"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Upload, Image } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "@/styles/TranslatorGroup.module.scss";
import classNames from "classnames";
import UploadImg from "@/components/client/Upload/Upload";

const cx = classNames.bind(styles);

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const RegisterGroup: React.FC = () => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
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
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item label="Mô tả">
          <Input.TextArea placeholder="" />
        </Form.Item>
        <Form.Item label="Ảnh nhóm dịch">
          <UploadImg />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
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
