import React, { useEffect, useState } from "react";
import PostList from "../../component/PostList";
import BasicLayout from "../../../common/layout/basicLayout/BasicLayout";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 게시글 데이터를 가져오는 API 호출 (더미 데이터 사용)
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/community/posts"); // API 호출
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <BasicLayout>
      <div>
        <h1>게시글 목록</h1>
        {loading ? <p>로딩 중...</p> : <PostList posts={posts} />}
      </div>
    </BasicLayout>
  );
};

export default PostListPage;
