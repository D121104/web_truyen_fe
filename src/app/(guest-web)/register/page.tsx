"use client";

"use client";

import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/Register.module.scss";
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import { IUser } from "@/types/backend";
import { Option } from "antd/es/mentions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { callRegister } from "@/config/api";
import { toast } from "react-toastify";
import { GoogleCircleFilled } from "@ant-design/icons";

const cx = classNames.bind(styles);

const Register = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useRouter();

  const handleSubmit = async (values: any) => {
    delete values.confirmPassword;
    setIsSubmit(true);
    const res = await callRegister(values);
    setIsSubmit(false);
    if (res?.data?._id) {
      toast.success("Đăng ký tài khoản thành công!");
      navigate.push("/login");
    } else {
      toast.error(res?.message ?? "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("heading")}>
          <h2> Đăng Ký Tài Khoản </h2>
        </div>
        <Form<IUser> name="basic" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            labelCol={{ span: 24 }}
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Nhập lại mật khẩu"
            dependencies={["password"]}
            name="confirmPassword"
            rules={[
              { required: true, message: "Trường này không được để trống!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Đăng ký
            </Button>
          </Form.Item>
          <Divider> Hoặc </Divider>
          <a
            href={`http://localhost:8080/api/auth/google`}
            className={cx("social-login")}
          >
            <div className={cx("gsi-material-button")}>
              <div className={cx("gsi-material-button-state")}></div>
              <div className={cx("gsi-material-button-content-wrapper")}>
                <div className={cx("gsi-material-button-icon")}></div>
                <GoogleCircleFilled style={{ fontSize: "25px" }} />
                <span className={cx("gsi-material-button-contents")}>
                  Đăng nhập với Google
                </span>
                <span style={{ display: "none" }}>Đăng nhập với Google</span>
              </div>
            </div>
          </a>
          <p className="text text-normal">
            {" "}
            Đã có tài khoản ?
            <span>
              <Link href="/login"> Đăng Nhập </Link>
            </span>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;
