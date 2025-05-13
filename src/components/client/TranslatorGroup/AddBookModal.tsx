import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setOpenAddBook, setPageTitle } from "@/lib/redux/slice/auth.slice";
import UploadImg from "../Upload/Upload";
import { createBook } from "@/config/api";
import { toast } from "react-toastify";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddBookModal: React.FC<IProps> = (props: IProps) => {
  const { open, setOpen } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm(); // Sử dụng Ant Design Form instance
  const dispatch = useAppDispatch();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      setConfirmLoading(true);

      const res = await createBook(values);

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
