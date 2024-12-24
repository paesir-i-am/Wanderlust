import React from "react";

const PostItem = ({ post }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{post.title}</h3>
      <p style={styles.content}>{post.content}</p>
      <img
        src={post.imageUrl}
        alt={post.title}
        style={styles.image}
        onError={(e) => (e.target.style.display = "none")} // 이미지 로드 실패 시 숨김
      />
      <p style={styles.author}>작성자: {post.authorNickname}</p>
      <p style={styles.date}>
        작성일: {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

// 간단한 스타일링
const styles = {
  container: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
  content: {
    margin: "8px 0",
  },
  image: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  author: {
    fontSize: "14px",
    color: "#555",
  },
  date: {
    fontSize: "12px",
    color: "#888",
  },
};

export default PostItem;
