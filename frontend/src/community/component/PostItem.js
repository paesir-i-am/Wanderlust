import React, { useState } from "react";
import LikeButton from "../component/LikeButton";
import { useSelector } from "react-redux";

const PostItem = ({ post, onEdit, onDelete, currentUserNickname }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(null);

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

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}
    >
      <h3>{post.authorNickname}</h3>

      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{ width: "100%", height: "50px", marginBottom: "10px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditedImage(e.target.files[0])}
          />
          <button onClick={handleSave} style={{ marginRight: "10px" }}>
            저장
          </button>
          <button onClick={handleCancel}>취소</button>
        </>
      ) : (
        <>
          <p>{post.content}</p>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Post"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          )}
          <LikeButton id={post.id} token={token} />
          {isOwner && (
            <div>
              <button
                onClick={() => setIsEditing(true)}
                style={{ marginRight: "10px" }}
              >
                수정
              </button>
              <button
                onClick={() => onDelete(post.id)}
                style={{ color: "red" }}
              >
                삭제
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostItem;
