"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  BookOutlined,
  DashboardOutlined,
  UserSwitchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector((state: any) => state.auth.user);
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>("dashboard");
  const handleMenuClick = (key: string) => {
    switch (key) {
      case "user":
        router.push("/admin/user");
        break;
      case "book":
        router.push("/admin/book");
        break;
      case "dashboard":
        router.push("/admin");
        break;
      case "translator-group":
        router.push("/admin/translator-group");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (pathname.startsWith("/admin/user")) {
      setSelectedKey("user");
    } else if (pathname.startsWith("/admin/book")) {
      setSelectedKey("book");
    } else if (pathname.startsWith("/admin/translator-group")) {
      setSelectedKey("translator-group");
    } else {
      setSelectedKey("dashboard");
    }
  }, [pathname]);

  return (
    <Sider
      width={250}
      style={{
        height: "100vh",
        background: "#001529",
        color: "#fff",
        position: "fixed",
        left: 0,
      }}
    >
      <div
        style={{
          padding: "16px",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px", // Khoảng cách giữa icon và chữ
        }}
      >
        <UserOutlined style={{ fontSize: "20px" }} />
        Xin chào, {user?.name || "Admin"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => handleMenuClick(e.key)}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          {
            key: "user",
            icon: <UserOutlined />,
            label: "Quản lý User",
          },
          {
            key: "book",
            icon: <BookOutlined />,
            label: "Quản lý Book",
          },
          {
            key: "translator-group",
            icon: <TeamOutlined />,
            label: "Quản lý nhóm dịch",
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
