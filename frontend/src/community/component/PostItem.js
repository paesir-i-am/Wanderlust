import React from "react";

const PostItem = ({ post }) => {
  const { authorNickname, content, imageUrl } = post;

  return (
    <div className="post-item">
      {imageUrl && <img src={imageUrl} alt="Post" />}
      <h3>{authorNickname}</h3>
      <p>{content}</p>
    </div>
  );
};

export default PostItem;
