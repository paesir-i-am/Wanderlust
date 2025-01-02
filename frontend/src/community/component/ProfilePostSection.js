import React from "react";
import "./scss/profile/ProfilePostSection.css";

const fullImageUrl = (imageUrl) => {
  return `http://localhost:8080${imageUrl}`;
};

const ProfilePostSection = ({ post, onPostClick }) => {
  return (
    <div className="post-section">
      <h3>게시물</h3>
      <div className="posts-grid">
        {post.map((post) => (
          <div
            key={post.id}
            className="post-item"
            onClick={() => onPostClick(post)}
          >
            <img
              className="post-image"
              src={fullImageUrl(post.imageUrl)}
              alt="Post"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePostSection;
