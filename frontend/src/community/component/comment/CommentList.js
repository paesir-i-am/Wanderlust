import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { fetchComments } from "../../api/commentApi";
import buildCommentTree from "./buildCommentTree";
import "../scss/comment/CommentList.css";

const CommentList = ({
  postId,
  currentUserNickname,
  onCommentCountChange,
  onUpdate,
  onDelete,
}) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId); // 댓글 데이터 불러오기
        const tree = buildCommentTree(data); // 댓글 계층화
        setComments(tree);

        // 댓글 개수 계산 및 전달
        if (onCommentCountChange) {
          onCommentCountChange(data.length);
        }
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    };
    loadComments();
  }, [postId, onCommentCountChange]);

  return (
    <div className="comment-list">
      <CommentForm
        postId={postId}
        onCommentCreated={() => {
          const reloadComments = async () => {
            const data = await fetchComments(postId);
            const tree = buildCommentTree(data);
            setComments(tree);

            // 댓글 개수 업데이트
            if (onCommentCountChange) {
              onCommentCountChange(data.length);
            }
          };
          reloadComments();
        }}
      />
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserNickname={currentUserNickname}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
