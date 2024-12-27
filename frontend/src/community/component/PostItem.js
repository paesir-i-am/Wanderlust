import React, { useState } from "react";

const PostItem = ({ post, onEdit, onDelete, currentUserNickname }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedContent(post.content); // 초기값으로 복원
  };

  const handleEditSave = () => {
    onEdit(post.id, editedContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(post.id);
  };

  const isOwner = currentUserNickname === post.authorNickname;

  return (
    <div
      style={{
        height: "auto",
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        marginBottom: "10px",
      }}
    >
      <h3>{post.authorNickname}</h3>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        />
      ) : (
        <p>{post.content}</p>
      )}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
      {isOwner && (
        <div style={{ marginTop: "10px" }}>
          {isEditing ? (
            <button onClick={handleEditSave} style={{ marginRight: "10px" }}>
              저장
            </button>
          ) : (
            <button onClick={handleEditToggle} style={{ marginRight: "10px" }}>
              수정
            </button>
          )}
          <button onClick={handleDelete} style={{ color: "red" }}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
