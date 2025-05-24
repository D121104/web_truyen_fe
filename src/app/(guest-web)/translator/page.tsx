"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Content.module.scss";
import classNames from "classnames/bind";

import { useAppSelector } from "@/lib/redux/hooks";

import RegisterGroup from "@/components/client/TranslatorGroup/RegisterGroup";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

const Content: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || !user._id) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || !user._id) {
    return null;
  }

  return (
    <div className={cx("contentWrapper")}>
      <div className={cx("mainWrapper")}>
        <RegisterGroup />
      </div>
    </div>
  );
};

export default Content;
