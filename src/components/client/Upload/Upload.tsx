import React, { useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import { toast } from "react-toastify";

interface IProps {
  onUploadSuccess: (url: string) => void;
}

const UploadImg: React.FC<IProps> = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState<string>("");

  const handleUploadFile = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      setLoading(false);
      onUploadSuccess(info.file.response.data[0]);
      setUrl(info.file.response.data[0]);
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
        maxCount={1}
        onChange={handleUploadFile}
        multiple={false}
        onPreview={() => {
          window.open(url);
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

export default UploadImg;
