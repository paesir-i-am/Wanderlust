import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { fetchComments } from "../api/commentApi";

const CommentList = ({ postId, currentUserNickname }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId);
        setComments(data);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    };
    loadComments();
  }, [postId]);

  const handleUpdate = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  };

  const handleDelete = (id) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id),
    );
  };

  return (
    <div>
      <CommentForm
        postId={postId}
        onCommentCreated={() => {
          const loadComments = async () => {
            const data = await fetchComments(postId);
            setComments(data);
          };
          loadComments();
        }}
      />
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserNickname={currentUserNickname}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
