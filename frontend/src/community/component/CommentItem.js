import React, { useState } from "react";
import { updateComment, deleteComment } from "../api/commentApi";
import CommentForm from "./CommentForm";

const CommentItem = ({
  comment,
  postId,
  currentUserNickname,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isOwner = currentUserNickname === comment.authorNickname;

  const handleEdit = async () => {
    try {
      const updatedComment = await updateComment(comment.id, editedContent);
      setIsEditing(false);
      onUpdate(updatedComment);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  const paddingLeft = `${(comment.paddingLeft || 0) * 20}px`;

  return (
    <div
      style={{
        marginBottom: "10px",
        borderBottom: "1px solid #ddd",
        padding: "10px",
        paddingLeft,
      }}
    >
      <h4>{comment.authorNickname}</h4>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{ width: "100%", height: "50px" }}
        />
      ) : (
        <p>{comment.content}</p>
      )}

      {isOwner && (
        <div>
          {isEditing ? (
            <>
              <button onClick={handleEdit}>저장</button>
              <button onClick={() => setIsEditing(false)}>취소</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>수정</button>
              <button onClick={handleDelete} style={{ color: "red" }}>
                삭제
              </button>
            </>
          )}
        </div>
      )}

      <button onClick={() => setShowReplyForm((prev) => !prev)}>
        {showReplyForm ? "답글 숨기기" : "답글 작성"}
      </button>

      {showReplyForm && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          onCommentCreated={() => setShowReplyForm(false)}
        />
      )}

      {/* 대댓글 렌더링 */}
      {comment.children &&
        comment.children.map((childComment) => (
          <CommentItem
            key={childComment.id}
            comment={childComment}
            postId={postId}
            currentUserNickname={currentUserNickname}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};

export default CommentItem;
