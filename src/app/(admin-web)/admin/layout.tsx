import React from "react";

import { Metadata } from "next";

// import Sidebar from "@/components/admin/Sidebar/Sidebar";
import StyledComponentsRegistry from "@/lib/antd.registry";
import { ConfigProvider } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import StoreProvider from "@/app/StoreProvider";
import LayoutApp from "@/components/layout/LayoutApp";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Header from "@/components/admin/Header/Header";
import Sidebar from "@/components/admin/Sidebar/Sidebar";

import "../../globals.css";

export const metadata: Metadata = {
  title: "Web Book",
  description: "Welcome to Next.js",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="admin-wrapper">
        <div className="admin-container">
          <StoreProvider>
            <ConfigProvider
              locale={vi_VN}
              theme={{
                token: {
                  colorPrimary: "#17252A",
                  colorPrimaryHover: "#2B7A78",
                  colorPrimaryActive: "#17252A",
                  borderRadius: 13,
                },
                components: {
                  Button: {
                    colorPrimary: "#17252A",
                    colorPrimaryHover: "#2B7A78",
                    colorPrimaryActive: "#17252A",
                  },
                },
              }}
            >
              <StyledComponentsRegistry>
                <LayoutApp>
                  <LayoutAdmin>
                    <Header />
                    <Sidebar />
                    <div
                      style={{ marginLeft: "300px" }}
                      className="admin-content"
                    >
                      {children}
                    </div>
                  </LayoutAdmin>
                </LayoutApp>
              </StyledComponentsRegistry>
            </ConfigProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
