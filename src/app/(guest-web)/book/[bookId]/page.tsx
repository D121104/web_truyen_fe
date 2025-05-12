"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Content.module.scss";
import TrendingBook from "@/components/client/Book/Book.carousel";

import { ThunderboltFilled } from "@ant-design/icons";
import classNames from "classnames/bind";
import BookNew from "@/components/client/Book/BookNew";
import BookSidebar from "@/components/client/Book/Book.sidebar";
import HistorySection from "@/components/client/Book/BookHistorySection";
import BookRankSidebar from "@/components/client/Book/BookRank.sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slice/auth.slice";
import BookDetail from "@/components/client/Book/BookDetail";
import { IComment } from "@/types/backend";
import { createComment, getComments } from "@/config/api";
import { message } from "antd";

const cx = classNames.bind(styles);

const Content: React.FC = (props: any) => {
  const dispatch = useAppDispatch();

  const [comments, setComments] = useState<IComment[]>([]);

  const [totalComments, setTotalComments] = useState(0);

  const [commentValue, setCommentValue] = useState("");

  const [commentLoading, setCommentLoading] = useState(false);

  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  // useEffect(() => {
  //   const initComments = async () => {
  //     const commentList = await getComments({
  //       current: 1,
  //       pageSize: 50,

  //       bookId: props?.params?.id,
  //     });
  //     let totalLenght = commentList.data?.result?.length as number;

  //     commentList.data?.result?.forEach((comment: IComment) => {
  //       totalLenght += ((comment.right ?? 0) - (comment.left ?? 0) - 1) / 2;
  //     });

  //     setTotalComments(totalLenght);

  //     setComments(commentList.data?.result as IComment[]);
  //   };
  //   initComments();
  // }, []);

  useEffect(() => {
    dispatch(setPageTitle(""));
  }, []);

  const handleComment = (e: any) => {
    setCommentValue(e.target.value);
  };

  const handleSendComment = async (e: any) => {
    if (e.key === "Enter") {
      if (commentLoading) return;

      if (!isAuth) {
        message.error("Vui lòng đăng nhập");
        return;
      }
      if (!commentValue.trim()) return;

      setCommentLoading(true);
      const res = await createComment({
        bookId: props?.params?.id,
        content: commentValue,
      });

      if (res.data) {
        setComments((prev: any) => {
          return [res.data, ...prev];
        });
        message.success("Bình luận thành công");
        setTotalComments((prev: any) => prev + 1);
        setCommentValue("");
      }
      setCommentLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (commentLoading) return;

    if (!isAuth) {
      message.error("Vui lòng đăng nhập");
      return;
    }

    if (!commentValue.trim()) return;

    setCommentLoading(true);

    const res = await createComment({
      bookId: props?.params?.id,
      content: commentValue,
    });

    if (res.data) {
      setComments((prev: any) => {
        return [res.data, ...prev];
      });

      message.success("Bình luận thành công");
      setTotalComments((prev: any) => prev + 1);
      setCommentValue("");
    }
    setCommentLoading(false);
  };
  return (
    <div className={cx("contentWrapper")}>
      <div className={cx("mainWrapper")}>
        <div className={cx("mainContent")}>
          <BookDetail />
          <div className={cx("book-comment")}>
            <div className={cx("section-comment")}>
              <div className={cx("comment-header")}>
                <h2 className={cx("comment-title")}>
                  {totalComments} bình luận
                </h2>
                <div className={cx("comment-form")}>
                  <input
                    onChange={handleComment}
                    value={commentValue}
                    onKeyDown={handleSendComment}
                    type="text"
                    placeholder="Viết bình luận"
                    className={cx("form-control")}
                  />
                  <button onClick={handleSubmit} className={cx("send-comment")}>
                    Gửi
                  </button>
                </div>
              </div>
              <div className={cx("bar")} />

              <div className={cx("comment-list")}>
                {/* {comments?.map((comment: IComment) => {
                  return (
                    <CompanyComment
                      setComments={setComments}
                      company={company}
                      setTotalComments={setTotalComments}
                      level={0}
                      key={comment._id}
                      comment={comment}
                    />
                  );
                })} */}
              </div>
            </div>
          </div>
        </div>
        <div className={cx("sidebar")}>
          <BookRankSidebar />
        </div>
      </div>
    </div>
  );
};

export default Content;
