"use client";

import { Layout, Row, Col, Typography, List } from "antd";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

const AdminContent = (props: IProps) => {
  const { Content } = Layout;
  const { children } = props;
  const data = [
    "Dashboard Overview",
    "User Management",
    "Analytics and Reports",
    "Settings and Preferences",
    "Notifications",
    "System Logs",
    "Help and Support",
  ];

  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <Row
        justify="center"
        style={{
          maxWidth: "1400px", // Tăng chiều rộng tối đa của Row
          margin: "0 auto", // Căn giữa Row
          padding: "0 16px", // Thêm padding để tạo khoảng cách ở hai bên
        }}
        gutter={[16, 16]} // Khoảng cách giữa các cột (16px ngang, 16px dọc)
      >
        <Col
          xs={24} // Chiếm toàn bộ chiều rộng trên màn hình rất nhỏ
          sm={24} // Chiếm toàn bộ chiều rộng trên màn hình nhỏ
          md={22} // Chiếm 22/24 chiều rộng trên màn hình trung bình
          lg={20} // Chiếm 20/24 chiều rộng trên màn hình lớn
          xl={20} // Chiếm 20/24 chiều rộng trên màn hình rất lớn
          xxl={18} // Chiếm 18/24 chiều rộng trên màn hình cực lớn
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#ccc",
              borderRadius: 8, // Thay đổi borderRadius để phù hợp
            }}
          >
            {children || "Content"}
            <Typography.Title level={3} style={{ textAlign: "center" }}>
              Admin Dashboard
            </Typography.Title>
            <List
              bordered
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default AdminContent;
