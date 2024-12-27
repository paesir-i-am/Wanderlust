import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p>No Posts Available</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: "0" }}>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
};

export default PostList;
