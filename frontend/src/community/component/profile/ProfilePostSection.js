import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "../scss/profile/ProfilePostSection.css";

const ProfilePostSection = ({ posts, onPostClick, loadMorePosts, hasMore }) => {
  return (
    <div className="profile-post-section">
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          endMessage={<p className="end-message">No more posts to display.</p>}
        >
          <div className="post-grid">
            {posts.map((post) => (
              <div
                key={post.id}
                className="post-item"
                onClick={() => onPostClick(post)}
              >
                <img
                  src={`http://localhost:8080${post.imageUrl}`}
                  alt="Post Thumbnail"
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ProfilePostSection;
