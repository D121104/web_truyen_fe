"use client";

import Content from "@/components/client/Content/Content";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Truyện mới cập nhật"));
  }, []);
  return (
    <div>
      <Content></Content>
    </div>
  );
}
