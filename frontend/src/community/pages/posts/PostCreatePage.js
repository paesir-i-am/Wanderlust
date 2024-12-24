import React from "react";
import PostForm from "../../component/PostForm";
import { createPost } from "../../api/postApi";
import BasicLayout from "../../../common/layout/basicLayout/BasicLayout";

const PostCreatePage = () => {
  const handleSubmit = async (postData) => {
    try {
      await createPost(postData);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <BasicLayout>
      <div>
        <h1>Create Post</h1>
        <PostForm onSubmit={handleSubmit} />
      </div>
    </BasicLayout>
  );
};

export default PostCreatePage;
