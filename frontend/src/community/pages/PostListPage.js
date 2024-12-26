import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import PostForm from "../component/PostForm";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/community/posts`, {
        params: {
          page: page,
          size: 10, // 한 번에 가져올 데이터 수
        },
      });

      const newPosts = response.data.content;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(!response.data.last); // 마지막 페이지 여부
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <BasicLayout>
      <PostForm />
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>모든 포스트를 불러왔습니다!</p>
        }
      >
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.authorNickname}</h3>
            <p>{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{
                  width: "200px",
                  height: "200px",
                }}
              />
            )}
          </div>
        ))}
      </InfiniteScroll>
    </BasicLayout>
  );
};

export default PostListPage;
