"use client";
import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames/bind";
import styles from "@/styles/Header.module.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Avatar,
  Dropdown,
  Skeleton,
  Space,
  message,
  Button,
  notification,
  Typography,
  Layout,
  Input,
  Menu,
  Badge,
  Flex,
} from "antd";
import Icon, {
  ContactsOutlined,
  DashOutlined,
  FileWordOutlined,
  InsertRowLeftOutlined,
  DownOutlined,
  LogoutOutlined,
  StarFilled,
  ClockCircleOutlined,
  NotificationFilled,
  UserOutlined,
  CaretDownFilled,
  BellFilled,
  TagsFilled,
  HomeFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { fetchNotifications, logout } from "@/config/api";
import { setLogoutAction } from "@/lib/redux/slice/auth.slice";
// import ManageUser from "./User.manage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircle } from "@fortawesome/free-solid-svg-icons";
import { INotification } from "@/types/backend";
import NotificationCard from "./Notification.card";
const { Search } = Input;
import { SearchProps } from "antd/es/input";
import classNames from "classnames";
import { MenuProps } from "antd/lib";
import CategoryDropdown from "@/components/client/Header/Category.dropdown";
import RankingDropdown from "@/components/client/Header/Ranking.dropdown";
import ManageUser from "./User.manage";
// import socket from "@/utils/socket";
const cx = classnames.bind(styles);

interface IMessageFromServer {
  message: string;
  bookId: string;
  type: string;
}

const Header: React.FC = () => {
  const isAuth = useAppSelector((state) => state?.auth.isAuthenticated);
  const user = useAppSelector((state) => state?.auth.user);
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const loading = useAppSelector((state) => state?.auth.isLoading);
  const [isNoti, setIsNoti] = useState<boolean>(false);
  const [isNewNoti, setIsNewNoti] = useState<boolean>(false);
  const userRole = user?.role;
  const notiRef = useRef<HTMLDivElement>(null);
  const [api, contextHolder] = notification.useNotification();
  const [current, setCurrent] = useState("");

  // useEffect(() => {
  //     socket.on("notification", (data: IMessageFromServer) => {
  //         api.open({
  //             message: <h3 style={{ color: "rgb(1, 126, 183)" }}>Thông Báo</h3>,
  //             description: data.message,
  //             duration: 10,
  //         });
  //         const newNoti = {
  //             content: data.message,
  //             createdAt: new Date().toISOString(),
  //             options: { jobId: data.jobId },
  //             type: data.type,
  //         } as INotification;

  //         setNotifications((prevNotifications) => [newNoti, ...prevNotifications]);
  //         setIsNewNoti(true);
  //     });

  //     return () => {
  //         console.log("Unregistering socket event");
  //         socket.off("notification");
  //     };
  // }, []);

  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const data = await logout();
    dispatch(setLogoutAction({}));
    window.location.reload();
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setIsNoti(true);
    setIsNewNoti(false);
  };

  useEffect(() => {
    if (isAuth) {
      const getNotification = async () => {
        try {
          const res = await fetchNotifications({});

          if (res.data) {
            setNotifications(res.data.result as INotification[]);
          }
        } catch (error) {}
      };

      getNotification();
    }
  }, [isAuth]);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setIsNoti(false);
      }
    });

    return () => {
      document.body.removeEventListener("click", () => {});
    };
  }, []);

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
          THỂ LOẠI <CaretDownFilled style={{ fontSize: 12 }} />
          <CategoryDropdown />
        </>
      ),
    },
    {
      key: "history",
      icon: <ClockCircleFilled />,
      label: (
        <>
          LỊCH SỬ <CaretDownFilled style={{ fontSize: 12 }} />
        </>
      ),
    },
    { key: "follow", label: "THEO DÕI" },
    {
      key: "ranking",
      label: (
        <>
          XẾP HẠNG <CaretDownFilled style={{ fontSize: 12 }} />
          <RankingDropdown></RankingDropdown>
        </>
      ),
    },
    { key: "boy", label: "CON TRAI" },
    { key: "girl", label: "CON GÁI" },
    { key: "manhwa", label: "MANHWA 18" },
    { key: "group", label: "GROUP" },
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
                <div>
                  <Avatar size="default" icon={<UserOutlined />} />
                  <Dropdown
                    menu={{ items: itemsDropdown as any }}
                    trigger={["click"]}
                    arrow={true}
                  >
                    <Space style={{ cursor: "pointer" }}>
                      <span>Xin chào {user?.name}</span>
                      <Avatar>
                        {" "}
                        {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                      </Avatar>
                    </Space>
                  </Dropdown>
                </div>
              ) : (
                <Flex gap="small" style={{ marginRight: 20 }}>
                  <Button type="primary" href="/login">
                    ĐĂNG NHẬP{" "}
                  </Button>
                  <Button type="primary" href="/register">
                    ĐĂNG KÝ{" "}
                  </Button>
                </Flex>
              )}
            </Flex>
          </div>
          <div className="header-bottom">
            <Flex justify="center" align="center">
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
