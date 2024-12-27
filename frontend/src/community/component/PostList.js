import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts, onEdit, onDelete, currentUserNickname }) => {
  if (posts.length === 0) {
    return <p>No posts found.</p>;
  }
  return (
    <div>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserNickname={currentUserNickname}
        />
      ))}
    </div>
  );
};

export default PostList;
