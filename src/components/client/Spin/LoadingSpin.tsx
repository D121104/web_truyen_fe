import React from "react";
import { Flex, Spin } from "antd";

const LoadingSpin: React.FC = () => (
  <Flex
    gap="middle"
    vertical
    align="center"
    justify="center"
    style={{ height: "100vh" }}
  >
    <Flex gap="middle">
      <Spin tip="Loading" size="large"></Spin>
    </Flex>
  </Flex>
);

export default LoadingSpin;
