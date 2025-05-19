"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setOpenAddBook, setPageTitle } from "@/lib/redux/slice/auth.slice";
import UploadImg from "../Upload/Upload";
import { createBook, getCategories, updateBook } from "@/config/api";
import { toast } from "react-toastify";
import { IBook, ICategory } from "@/types/backend";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  book: IBook | null; // Thông tin sách cần chỉnh sửa
  updateBookInList: (updatedBook: IBook) => void; // Hàm cập nhật danh sách sách
}

const EditBookModal: React.FC<IProps> = (props: IProps) => {
  const { open, setOpen, book, updateBookInList } = props;
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm(); // Sử dụng Ant Design Form instance
  const dispatch = useAppDispatch();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values._id = book._id; // Thêm _id vào giá trị form
      console.log("Form values:", values);

      setConfirmLoading(true);

      const res = await updateBook(values);

      if (res.code === 200) {
        setOpen(false);
        form.resetFields();
        setConfirmLoading(false);
        toast.success("Chỉnh sửa truyện thành công");

        updateBookInList(values);
        return;
      }
      const errorMessage = Array.isArray(res.message)
        ? res.message.join(", ") // Nối các phần tử trong mảng bằng dấu phẩy
        : res.message || "Chỉnh sửa truyện thất bại"; // Nếu không phải mảng, lấy trực tiếp message

      console.log("Error:", res);
      toast.error(errorMessage);
      setConfirmLoading(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(setPageTitle("Thêm truyện"));
    // Gọi API để lấy danh sách thể loại
    const fetchCategories = async () => {
      try {
        const res = await getCategories({ current: 1, pageSize: 100 });
        if (res.code === 200) {
          setCategories(res.data.result);
        } else {
          toast.error("Không thể tải danh sách thể loại");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
      }
    };

    fetchCategories(); // Gọi hàm để lấy danh sách thể loại

    if (book) {
      form.setFieldsValue({
        ...book,
        categories: Array.isArray(book.categories)
          ? book.categories.map((cat) =>
              typeof cat === "string" ? cat : cat._id
            )
          : [],
      });
    }
  }, [dispatch, setCategories, book, form]);

  return (
    <>
      <Modal
        title={`Chỉnh sửa truyện`}
        open={open}
        onOk={handleOk} // Gọi handleOk khi nhấn OK
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form} // Gắn form instance
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
            name="bookTitle"
            rules={[{ required: true, message: "Vui lòng nhập tên truyện!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tác giả"
            name="author"
            rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            label="Mô tả"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            label="Thể loại"
            name="categories"
          >
            <Checkbox.Group
              options={categories.map((cat) => ({
                label: cat.categoryName,
                value: cat._id,
              }))}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="inProgress">Đang tiến hành</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Bìa truyện" name="imgUrl">
            <UploadImg
              onUploadSuccess={(url: string) => {
                form.setFieldsValue({ imgUrl: url });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditBookModal;
