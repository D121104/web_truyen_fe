import React from "react";
import { Flex, Spin } from "antd";

const LoadingSpin: React.FC = () => (
  <Flex gap="middle" vertical>
    <Flex gap="middle">
      <Spin tip="Loading" size="large"></Spin>
    </Flex>
  </Flex>
);

export default LoadingSpin;
