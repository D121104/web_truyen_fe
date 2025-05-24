"use client";
import React, { useRef, useState } from "react";
import classnames from "classnames/bind";
import styles from "@/styles/Header.module.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Avatar, Dropdown, Skeleton, Space, Button, Badge, Flex } from "antd";
import {
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  UserOutlined,
  BellFilled,
} from "@ant-design/icons";

import { setLogoutAction } from "@/lib/redux/slice/auth.slice";
// import ManageUser from "./User.manage";

import ManageUser from "@/components/client/Header/User.manage";
import { useRouter } from "next/navigation";
import { logout } from "@/config/api";
// import socket from "@/utils/socket";
const cx = classnames.bind(styles);

const Header: React.FC = () => {
  const isAuth = useAppSelector(
    (state) => state?.auth.isAuthenticated as boolean
  );
  const user = useAppSelector((state) => state?.auth.user);
  const [open, setOpen] = useState<boolean>(false);

  const loading = useAppSelector((state) => state?.auth.isLoading);

  const userRole = user?.role;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await logout();
    dispatch(setLogoutAction({}));
    router.push("/");
  };

  const itemsDropdown = [
    {
      label: (
        <label onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    userRole !== "USER" && {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },

    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <div>
          <div className={cx("header-top")}>
            <Flex justify="flex-end" gap="large">
              <Space size="middle">
                <Badge count={5}>
                  <Avatar size="default" icon={<BellFilled />} />
                </Badge>
              </Space>
              {isAuth ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    paddingRight: 20,
                  }}
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Trang chủ
                  </Button>
                  <Avatar size="default" icon={<UserOutlined />} />
                  <Dropdown
                    menu={{ items: itemsDropdown as any }}
                    trigger={["click"]}
                    arrow={true}
                  >
                    <Space style={{ cursor: "pointer" }}>
                      <span>Xin chào {user?.name}</span>
                    </Space>
                  </Dropdown>
                </div>
              ) : (
                <Flex gap="small" style={{ marginRight: 20 }}>
                  <Link
                    href="/login"
                    style={{ display: "block", width: "100%" }}
                  >
                    <Button type="primary" style={{ width: "100%" }}>
                      ĐĂNG NHẬP
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    style={{ display: "block", width: "100%" }}
                  >
                    <Button type="primary" style={{ width: "100%" }}>
                      ĐĂNG KÝ
                    </Button>
                  </Link>
                </Flex>
              )}
            </Flex>
          </div>
        </div>
      )}
      <ManageUser open={open} setOpen={setOpen} />
    </div>
  );
};

export default Header;
