import React from "react";
import "../scss/profile/ProfilePostSection.css";

const ProfilePostSection = ({ posts = [], onPostClick }) => {
  return (
    <div className="profile-post-section">
      <h3>Posts</h3>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => onPostClick(post)}
            >
              <img
                src={`http://localhost:8080${post.imageUrl}`}
                alt="Post"
                className="post-image"
                style={{ width: "50px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePostSection;
