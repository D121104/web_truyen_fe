"use client";

import { Button, Result, Skeleton, message, notification } from "antd";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

interface IProps {
  children: React.ReactNode;
}

const LayoutAdmin = (props: IProps) => {
  const { children } = props;
  const role = useAppSelector((state: any) => state.auth.user.role);
  const isAuth = useAppSelector((state: any) => state.auth.isAuthenticated);
  const loading = useAppSelector((state: any) => state.auth.isLoading);
  const navigate = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuth) {
        navigate.push("/login", { scroll: false });
        return;
      }
      setShouldRender(true);
    }
  }, [loading]);

  if (role !== "ADMIN" && shouldRender) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập vào trang này."
        extra={
          <Button
            type="primary"
            onClick={() => navigate.push("/", { scroll: false })}
          >
            Quay về trang chủ
          </Button>
        }
      />
    );
  }

  return loading ? <Skeleton /> : <>{shouldRender && children}</>;
};

export default LayoutAdmin;
