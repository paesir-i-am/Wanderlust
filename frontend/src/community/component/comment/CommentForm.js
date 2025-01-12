import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createComment, createChildComment } from "../../api/commentApi";
import "../scss/comment/CommentForm.css";

const CommentForm = ({ postId, parentId = null, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const nickname = useSelector((state) => state.loginSlice.nickname);

  if (!nickname) {
    return (
      <p className="comment-form__login-message">
        댓글 작성을 위해 로그인이 필요합니다.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (parentId) {
        await createChildComment(parentId, postId, content, nickname);
      } else {
        await createComment(postId, content, nickname);
      }
      setContent("");
      if (onCommentCreated) onCommentCreated();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
      />
      <button type="submit">{parentId ? "대댓글 작성" : "댓글 작성"}</button>
    </form>
  );
};

export default CommentForm;
