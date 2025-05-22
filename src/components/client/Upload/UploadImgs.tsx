import React, { useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import { toast } from "react-toastify";

interface IProps {
  onUploadSuccess: (url: string) => void;
}

const UploadImgs: React.FC<IProps> = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]); // Lưu danh sách URL ảnh đã upload

  const handleUploadFile = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      setLoading(false);
      const uploadedUrl = info.file.response.data[0];
      const updatedUrls = [...urls, uploadedUrl]; // Thêm URL mới vào danh sách
      setUrls(updatedUrls);
      onUploadSuccess(updatedUrls as any); // Truyền danh sách URL đã upload ra ngoài
    } else if (info.file.status === "error") {
      setLoading(false);
      toast.error("Upload file thất bại");
    }
  };

  return (
    <>
      <Upload
        name="files"
        listType="picture-card"
        className="avatar-uploader"
        onChange={handleUploadFile}
        multiple={true} // Cho phép upload nhiều ảnh
        onPreview={(file) => {
          window.open(file.url || file.thumbUrl);
        }}
        action={`http://localhost:8080/api/image/upload`}
      >
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </>
  );
};

export default UploadImgs;
