import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import PostForm from "../component/PostForm";

const style = {
  height: "auto",
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: "#fff",
};

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async (currentPage) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await axios.get("/community/posts", {
        params: { page: currentPage, size: 10 },
      });

      const newPosts = response.data.content;
      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
      setHasMore(!response.data.last);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasMore) {
      fetchPosts(page);
    }
  }, [page]);

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <BasicLayout>
      <div
        id="scrollableDiv"
        style={{
          height: "500px",
          overflow: "auto",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <PostForm />
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center", margin: "20px 0" }}>
              모든 포스트를 불러왔습니다!
            </p>
          }
          scrollableTarget="scrollableDiv"
        >
          {posts.map((post) => (
            <div key={post.id} style={style}>
              <h3>{post.authorNickname}</h3>
              <p>{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </BasicLayout>
  );
};

export default PostListPage;
