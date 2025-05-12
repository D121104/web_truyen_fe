"use client";
import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd";
import classNames from "classnames/bind";
import styles from "../../../styles/Login.module.scss";
import Link from "next/link";
import { callLogin, createOtp } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/lib/redux/slice/auth.slice";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

type FieldType = {
  username: string;
  password: string;
  remember?: string;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const navigate = useRouter();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isLoading) {
      if (isAuth) {
        navigate.push("/");
        notification.error({
          message: "Bạn đã đăng nhập rồi!",
        });
        return;
      } else {
        setShow(true);
      }
    }
  }, [isLoading]);

  const handleClick = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setError("");
    if (isForgotPassword) {
      const { username } = values;
      setLoading(true);
      const res = await createOtp(username);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      toast.success("Đã gửi mã xác nhận đến email của bạn!");
      setLoading(false);
    } else {
      const { username, password } = values;
      setLoading(true);
      const res = await callLogin({ username, password });
      if (res?.data) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("userId", res.data.user._id);
        dispatch(setUserLoginInfo(res.data.user));
        setLoading(false);
        toast.success("Đăng nhập thành công!");
        navigate.push("/");
      } else {
        setError(res?.message ?? "Có lỗi xảy ra! Vui lòng thử lại sau!");
        setLoading(false);
      }
    }
  };

  return (
    show && (
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <h1 className={cx("title")}>
            {isForgotPassword ? "Quên mật khẩu" : "Đăng nhập"}
          </h1>

          {error && (
            <div
              style={{ color: "red", fontSize: "14px", marginBottom: "5px" }}
            >
              {error}
            </div>
          )}

          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              labelCol={{ span: 24 }}
              label="Email"
              name="username"
              required
              rules={[
                { required: true, message: "Email không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>

            {isForgotPassword ? (
              <></>
            ) : (
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
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isForgotPassword ? "Xác nhận" : "Đăng nhập"}
              </Button>
            </Form.Item>
            <Divider>Hoặc đăng nhập với</Divider>

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
              <span>
                <Link href="/register"> Đăng ký thành viên mới</Link>
              </span>
            </p>

            <p style={{ marginTop: "10px" }} className="text text-normal">
              <span>
                <Link href="#" onClick={handleClick}>
                  {" "}
                  {isForgotPassword ? "Đăng nhập" : "Quên mật khẩu"}
                </Link>
              </span>
            </p>
          </Form>
        </div>
      </div>
    )
  );
};

export default Login;
