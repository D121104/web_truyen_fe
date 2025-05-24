"use client";
import React, { useState } from "react";
import classnames from "classnames/bind";
import styles from "@/styles/Header.module.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Avatar,
  Dropdown,
  Skeleton,
  Space,
  Button,
  Input,
  Menu,
  Badge,
  Flex,
} from "antd";
import {
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  UserOutlined,
  CaretDownFilled,
  BellFilled,
  TagsFilled,
  HomeFilled,
  ClockCircleFilled,
  TeamOutlined,
} from "@ant-design/icons";
import { logout } from "@/config/api";
import { setLogoutAction } from "@/lib/redux/slice/auth.slice";
// import ManageUser from "./User.manage";

const { Search } = Input;
import { SearchProps } from "antd/es/input";

import { MenuProps } from "antd/lib";
import CategoryDropdown from "@/components/client/Header/Category.dropdown";
import RankingDropdown from "@/components/client/Header/Ranking.dropdown";
import ManageUser from "./User.manage";
import { useRouter } from "next/navigation";
// import socket from "@/utils/socket";
const cx = classnames.bind(styles);

const Header: React.FC = () => {
  const isAuth = useAppSelector((state) => state?.auth.isAuthenticated);
  const user = useAppSelector((state) => state?.auth.user);
  const [open, setOpen] = useState<boolean>(false);

  const loading = useAppSelector((state) => state?.auth.isLoading);

  const userRole = user?.role;

  const [current, setCurrent] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    dispatch(setLogoutAction({}));
    window.location.reload();
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
  const menuItems = [
    {
      key: "home",
      icon: <HomeFilled />,
      label: <Link href={"/"}>TRANG CHỦ</Link>,
    },
    {
      key: "category",
      icon: <TagsFilled />,
      label: (
        <>
          <Link href="/search">
            THỂ LOẠI <CaretDownFilled style={{ fontSize: 12 }} />
            <CategoryDropdown />
          </Link>
        </>
      ),
    },
    {
      key: "history",
      icon: <ClockCircleFilled />,
      label: (
        <>
          <Link href="/history">LỊCH SỬ</Link>
        </>
      ),
    },
    {
      key: "follow",
      label: (
        <>
          <Link href="/follow">THEO DÕI</Link>
        </>
      ),
    },
    {
      key: "ranking",
      label: (
        <>
          XẾP HẠNG <CaretDownFilled style={{ fontSize: 12 }} />
          <RankingDropdown></RankingDropdown>
        </>
      ),
    },

    {
      key: "group",

      label: (
        <>
          <TeamOutlined style={{ fontSize: 14, marginRight: 10 }} />

          <Link href={"/translator"}>NHÓM DỊCH</Link>
        </>
      ),
    },
  ];
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <div>
          <div className={cx("header-top")}>
            <Flex justify="flex-end" gap="large">
              <Search
                style={{ width: 300 }}
                placeholder="input search text"
                onSearch={(value) => onSearch(value)}
                enterButton
              />
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
                  <Avatar size="default" icon={<UserOutlined />} />
                  <Dropdown
                    menu={{ items: itemsDropdown as any }}
                    trigger={["click"]}
                    arrow={true}
                  >
                    <Space style={{ cursor: "pointer" }}>
                      <span>{user?.name}</span>
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
          <div className="header-bottom">
            <Flex justify="center" align="center" gap={20}>
              <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={menuItems}
              />
            </Flex>
          </div>
        </div>
      )}
      <ManageUser open={open} setOpen={setOpen} />
    </div>
  );
};

export default Header;
