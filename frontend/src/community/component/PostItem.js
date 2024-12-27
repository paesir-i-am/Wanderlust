import React from "react";
import LikeButton from "../component/LikeButton";
import { useSelector } from "react-redux";

const PostItem = ({ post, onEdit, onDelete, currentUserNickname }) => {
  const isOwner = currentUserNickname === post.authorNickname;
  const token = useSelector((state) => state.loginSlice.accessToken);

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
      <p>{post.content}</p>
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
      <LikeButton postId={post.id} token={token} />
      {isOwner && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => onEdit(post.id)}
            style={{ marginRight: "10px" }}
          >
            수정
          </button>
          <button onClick={() => onDelete(post.id)} style={{ color: "red" }}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
