import AdminContent from "@/components/adminLayout/admin.content";
import AdminFooter from "@/components/adminLayout/admin.footer";
import AdminHeader from "@/components/adminLayout/admin.header";
import AdminSidebar from "@/components/adminLayout/admin.sidebar";
import { Layout } from "antd";
import React from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Layout>
      <AdminSidebar />
      <Layout>
        <AdminHeader />
        <AdminContent>{children}</AdminContent>
        <AdminFooter />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
