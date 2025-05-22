"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import UploadImg from "../Upload/Upload";
import { createBook, createChapter } from "@/config/api";
import { toast } from "react-toastify";
import ChapterTable from "@/components/client/TranslatorGroup/ChapterTable";
import { IBook } from "@/types/backend";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  book: IBook | null;
  setBook: (book: IBook | null) => void; // Hàm cập nhật thông tin sách
  updateBookInList: (updatedBook: any) => void; // Hàm cập nhật danh sách sách
}

const EditChapterModal: React.FC<IProps> = (props: IProps) => {
  const { open, setOpen, book, setBook } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm(); // Sử dụng Ant Design Form instance
  const dispatch = useAppDispatch();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      setConfirmLoading(true);

      const res = await createChapter(values);

      if (res.code === 201) {
        setOpen(false);
        form.resetFields();
        setConfirmLoading(false);
        toast.success("Thêm truyện thành công");
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
  }, [dispatch]);

  return (
    <>
      <Modal
        open={open}
        onOk={handleOk} // Gọi handleOk khi nhấn OK
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
      >
        <ChapterTable book={book} setBook={setBook} />
      </Modal>
    </>
  );
};

export default EditChapterModal;
