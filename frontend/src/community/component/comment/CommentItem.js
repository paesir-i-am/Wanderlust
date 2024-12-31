import React, { useState } from "react";
import CommentForm from "./CommentForm";
import "../scss/comment/CommentItem.css";

const CommentItem = ({
  comment,
  postId,
  currentUserNickname,
  depth = 0,
  onUpdate,
  onDelete,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const isOwner = currentUserNickname === comment.authorNickname;

  const formatTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  return (
    <div className="comment-item" style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="comment-item__header">
        <h4 className="comment-item__author">{comment.authorNickname}</h4>
        <span className="comment-item__date">
          {formatTime(comment.createdAt)}
        </span>
      </div>
      <div className="comment-item__content">
        <p>{comment.content}</p>
      </div>
      <div className="comment-item__actions">
        {isOwner && (
          <>
            <button onClick={() => onUpdate(comment.id)}>수정</button>
            <button onClick={() => onDelete(comment.id)}>삭제</button>
          </>
        )}
        <button
          className="comment-item__reply-toggle"
          onClick={() => setShowReplyForm((prev) => !prev)}
        >
          {showReplyForm ? "답글 숨기기" : "답글 작성"}
        </button>
        {comment.children && comment.children.length > 0 && (
          <button
            className="comment-item__toggle-replies"
            onClick={() => setShowReplies((prev) => !prev)}
          >
            {showReplies
              ? "댓글 숨기기"
              : `댓글 더 보기 (${comment.children.length})`}
          </button>
        )}
      </div>

      {showReplyForm && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          onCommentCreated={() => setShowReplyForm(false)}
        />
      )}

      {showReplies &&
        comment.children.map((child) => (
          <CommentItem
            key={child.id}
            comment={child}
            postId={postId}
            currentUserNickname={currentUserNickname}
            depth={depth + 1}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};

export default CommentItem;
