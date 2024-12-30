import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createComment, createChildComment } from "../api/commentApi";

const CommentForm = ({ postId, parentId = null, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const nickname = useSelector((state) => state.loginSlice.nickname); // Redux에서 닉네임 가져오기

  if (!nickname) {
    return <p>댓글 작성을 위해 로그인이 필요합니다.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (parentId) {
        await createChildComment(parentId, postId, content, nickname);
      } else {
        await createComment(postId, content, nickname);
      }
      setContent(""); // 입력 폼 초기화
      if (onCommentCreated) onCommentCreated(); // 댓글 작성 후 목록 갱신
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        style={{ width: "100%", height: "50px" }}
      />
      <button type="submit" style={{ marginTop: "10px" }}>
        {parentId ? "대댓글 작성" : "댓글 작성"}
      </button>
    </form>
  );
};

export default CommentForm;
