import React from "react";
import PostList from "../component/PostList";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";

const PostListPage = () => {
  return (
    <BasicLayout>
      <div>
        <h1>Post List</h1>
        <PostList />
      </div>
    </BasicLayout>
  );
};

export default PostListPage;
