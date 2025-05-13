import React, { useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";

type FileType = File;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface UploadImgProps {
  onUploadSuccess: (url: string) => void; // Callback để trả về URL
}

const UploadImg: React.FC<UploadImgProps> = ({ onUploadSuccess }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Upload ngay khi file được chọn
    if (newFileList.length > 0) {
      setLoading(true); // Bật trạng thái loading
      const formData = new FormData();
      newFileList.forEach((file) => {
        formData.append("files", file.originFileObj as File); // Append each file to the 'files' field
      });

      try {
        const response = await fetch("http://localhost:8080/api/image/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const uploadedUrl = data[0]; // Giả sử API trả về mảng URL
          message.success("Upload thành công!");
          onUploadSuccess(uploadedUrl); // Gọi callback để trả về URL

          // Hiển thị preview ảnh sau khi upload thành công
          const uploadedFile = newFileList[0];
          uploadedFile.url = uploadedUrl;
          setFileList([uploadedFile]);
        } else {
          console.error("Error:", await response.text());
          message.error("Upload thất bại!");
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Upload thất bại!");
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    }
  };

  const uploadButton = loading ? (
    <div>
      <LoadingOutlined />
      <div style={{ marginTop: 8 }}>Đang tải...</div>
    </div>
  ) : (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} // Prevent automatic upload
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImg;