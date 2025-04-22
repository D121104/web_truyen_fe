import React from "react";

import { Metadata } from "next";

// import "../../styles/AdminLayout.scss";
// import Sidebar from "@/components/admin/Sidebar/Sidebar";
import StyledComponentsRegistry from "@/lib/antd.registry";
import { ConfigProvider } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import StoreProvider from '@/app/StoreProvider';
import LayoutApp from "@/components/layout/LayoutApp";
import LayoutAdmin from "@/components/layout/LayoutAdmin";

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
            <ConfigProvider locale={vi_VN}>
              <StyledComponentsRegistry>
                <LayoutApp>
                  <LayoutAdmin>
                    {/* <Sidebar /> */}
                    <div className="admin-content">{children}</div>
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