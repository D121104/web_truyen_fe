import React, { useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Form, Input, Modal, Upload } from "antd";
import { faker } from "@faker-js/faker";
import UploadImg from "@/components/client/Upload/Upload";

const { Meta } = Card;

const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(5),
    author: faker.person.fullName(),
    status: faker.helpers.arrayElement(["Đang cập nhật", "Hoàn thành"]),
    genres: faker.helpers.arrayElements(
      ["Adventure", "Manhua", "Supernatural", "Xuyên Không", "Truyện Màu"],
      faker.number.int({ min: 2, max: 5 })
    ),
    translator: faker.company.name(),
    views: faker.number.int({ min: 1000, max: 1000000 }),
    likes: faker.number.int({ min: 10, max: 10000 }),
    follows: faker.number.int({ min: 100, max: 50000 }),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    reviews: faker.number.int({ min: 10, max: 500 }),
    cover: faker.image.url({ width: 160, height: 200 }), // Hình ảnh giả
    description: faker.lorem.paragraphs(2),
    chapters: Array.from(
      { length: faker.number.int({ min: 10, max: 100 }) },
      (_, index) => ({
        chapter: index + 1,
        title: faker.lorem.words(3),
        time: `${faker.number.int({ min: 1, max: 7 })} ngày trước`,
        views: faker.number.int({ min: 1000, max: 10000 }),
      })
    ),
  }));
};

const BookList: React.FC = () => {
  const books = generateFakeBooks(5); // Tạo 5 cuốn sách giả

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return books.map((book) => (
    <>
      <Card
        style={{ width: 170, margin: 10 }}
        cover={<img alt={book.title} src={book.cover} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" onClick={showModal} />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
        key={book.id}
        loading={false}
      >
        <Meta
          // avatar={<Avatar src={book.cover} />}
          title={book.title}
          // description={book.description}
        />
      </Card>
      <Modal
        title={`Chỉnh sửa truyện:  ${book.title}`}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="wrap"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Tên truyện"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Tác giả" name="author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Bìa truyện"
            name="cover"
            rules={[{ required: true }]}
          >
            <UploadImg></UploadImg>
          </Form.Item>
        </Form>
      </Modal>
    </>
  ));
};
export default BookList;
