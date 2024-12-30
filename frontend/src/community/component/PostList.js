import React from "react";
import PostItem from "./PostItem";

const PostList = ({
  posts,
  onEdit,
  onDelete,
  currentUserNickname,
  renderComments,
}) => {
  if (posts.length === 0) {
    return <p>No posts found.</p>;
  }
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <PostItem
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserNickname={currentUserNickname}
          />
          {renderComments && renderComments(post.id)}
        </div>
      ))}
    </div>
  );
};

export default PostList;
