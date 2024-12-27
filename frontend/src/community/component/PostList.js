import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts, onEdit, onDelete, currentUserNickname }) => {
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
