import React from "react";

const PostItem = ({ post }) => {
  if (!post) return null;

  return (
    <li
      style={{
        margin: "20px 0",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>{post.authorNickname}</h3>
      <p>{post.content}</p>
      {post.imageUrl && (
        <img
          src={`http://localhost:8080${post.imageUrl}`}
          alt="Post"
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        />
      )}
      <p style={{ fontSize: "12px", color: "#666" }}>
        Created At: {new Date(post.createdAt).toLocaleString()}
      </p>
    </li>
  );
};

export default PostItem;
