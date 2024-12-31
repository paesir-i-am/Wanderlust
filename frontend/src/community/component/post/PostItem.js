import React, { useState } from "react";
import LikeButton from "../LikeButton";
import FollowButton from "../FollowButton";
import CommentList from "../comment/CommentList";
import { useSelector } from "react-redux";
import "../scss/post/PostItem.css";

const PostItem = ({ post, onEdit, onDelete, currentUserNickname }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0); // 댓글 개수 상태

  const MAX_LENGTH = 15;

  const token = useSelector((state) => state.loginSlice.accessToken);
  const isOwner = currentUserNickname === post.authorNickname;

  const imageUrl = post.imageUrl
    ? `http://localhost:8080${post.imageUrl}`
    : null;

  const handleSave = () => {
    onEdit(post.id, { content: editedContent }, editedImage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(post.content);
    setEditedImage(null);
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ko-KR", options);
  };

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__info">
          <h3 className="post__nickname">
            {post.authorNickname}
            {!isOwner && <FollowButton targetNickname={post.authorNickname} />}
          </h3>
          <span className="post__date">{formatDate(post.createdAt)}</span>
        </div>
        {isOwner && (
          <div className="post__actions">
            <button className="post__edit" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button className="post__delete" onClick={() => onDelete(post.id)}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="post__content">
        {isEditing ? (
          <>
            <textarea
              className="post__textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <input
              className="post__image-input"
              type="file"
              accept="image/*"
              onChange={(e) => setEditedImage(e.target.files[0])}
            />
            <button className="post__save" onClick={handleSave}>
              저장
            </button>
            <button className="post__cancel" onClick={handleCancel}>
              취소
            </button>
          </>
        ) : (
          <>
            <p className="post__text">
              {isExpanded
                ? post.content
                : `${post.content.slice(0, MAX_LENGTH)}...`}
            </p>
            {post.content.length > MAX_LENGTH && (
              <button className="post__toggle" onClick={toggleContent}>
                {isExpanded ? "접기" : "더 보기"}
              </button>
            )}
            {imageUrl && (
              <img className="post__image" src={imageUrl} alt="Post" />
            )}
            <div className="post__actions">
              <LikeButton id={post.id} token={token} />
              <button
                className="post__comment-icon"
                onClick={() => setShowComments((prev) => !prev)}
              >
                💬 댓글 {commentCount}
              </button>
            </div>
          </>
        )}
      </div>

      {showComments && (
        <div className="post__comments">
          <CommentList
            postId={post.id}
            currentUserNickname={currentUserNickname}
            onCommentCountChange={setCommentCount}
          />
        </div>
      )}
    </div>
  );
};

export default PostItem;
