import React, { useEffect, useState } from "react";
import PostList from "../component/PostList";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import PostForm from "../component/PostForm";
import { fetchPosts } from "../api/postApi";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <BasicLayout>
      <div>
        <PostForm onPostCreated={loadPosts} />
        <PostList posts={posts} />
      </div>
    </BasicLayout>
  );
};

export default PostListPage;
