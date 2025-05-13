import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setOpenAddBook, setPageTitle } from "@/lib/redux/slice/auth.slice";

const AddBookModal: React.FC = () => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.openAddBook);

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      dispatch(setOpenAddBook(false));
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    dispatch(setOpenAddBook(false));
  };

  useEffect(() => {
    dispatch(setPageTitle("Thêm truyện"));
  }, []);

  return (
    <>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default AddBookModal;
