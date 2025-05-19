"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, Form, Input, Modal, Select } from "antd";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import UploadImg from "../Upload/Upload";
import { createBook, getCategories } from "@/config/api";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { ICategory } from "@/types/backend";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => void; // Hàm để làm mới danh sách sách
}

const AddBookModal: React.FC<IProps> = (props: IProps) => {
  const { translatorGroupId } = useParams();
  const { open, setOpen, refresh } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm(); // Sử dụng Ant Design Form instance
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<ICategory[]>([]); // State để lưu danh sách thể loại

  const handleOk = async () => {
    try {
      let values = await form.validateFields();
      values = {
        ...values,
        translatorGroup: translatorGroupId, // Thêm translatorGroupId vào giá trị form
      }; // Thêm translatorGroupId vào giá trị form
      console.log("Form values:", values);

      setConfirmLoading(true);

      const res = await createBook(values, translatorGroupId); // Gọi API để tạo sách

      if (res.code === 201) {
        setOpen(false);
        form.resetFields();
        setConfirmLoading(false);
        toast.success("Thêm truyện thành công");
        refresh(); // Gọi hàm làm mới danh sách sách
        return;
      }
      const errorMessage = Array.isArray(res.message)
        ? res.message.join(", ") // Nối các phần tử trong mảng bằng dấu phẩy
        : res.message || "Thêm truyện thất bại"; // Nếu không phải mảng, lấy trực tiếp message

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
  }, [dispatch, setCategories]);

  return (
    <>
      <Modal
        title={`Thêm truyện`}
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

export default AddBookModal;
