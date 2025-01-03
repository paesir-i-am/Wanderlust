import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "../scss/profile/ProfilePostSection.css";

const ProfilePostSection = ({
  posts = [],
  onPostClick,
  loadMorePosts,
  hasMore,
}) => {
  return (
    <div className="profile-post-section">
      <h3>Posts</h3>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={<p>Loading...</p>}
          className="posts-grid"
        >
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
              />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ProfilePostSection;
