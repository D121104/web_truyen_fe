import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setOpenAddBook, setPageTitle } from "@/lib/redux/slice/auth.slice";
import UploadImg from "../Upload/Upload";

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
      // Validate và lấy giá trị từ form
      const values = await form.validateFields();
      console.log("Form values:", values);

      // Gửi dữ liệu lên server hoặc xử lý logic
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
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
            name="title"
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

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Bìa truyện"
            name="cover"
          >
            <UploadImg
              onUploadSuccess={(url: string) => {
                form.setFieldsValue({ cover: url });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddBookModal;