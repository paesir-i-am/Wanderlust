import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import PostForm from "../component/PostForm";
import PostList from "../component/PostList";
import { deletePost, fetchPosts, updatePost } from "../api/postApi";
import CommentList from "../component/CommentList";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Redux에서 현재 사용자 닉네임 가져오기
  const currentUserNickname = useSelector((state) => state.loginSlice.nickname);

  const loadPosts = async (currentPage) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const data = await fetchPosts(currentPage, 10);
      const newPosts = data.content;

      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
      setHasMore(!data.last);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      const response = await updatePost(id, formData);
      alert("수정되었습니다.");
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                content: response.data.content,
                imageUrl: response.data.imageUrl,
              }
            : post,
        ),
      );
      window.location.reload();
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await deletePost(id);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        alert("Successfully deleted posts.");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      alert("Failed to delete posts. Please try again.");
    }
  };

  useEffect(() => {
    if (hasMore) {
      loadPosts(page);
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
          <PostList
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserNickname={currentUserNickname}
            renderComments={(postId) => (
              <CommentList
                postId={postId}
                currentUserNickname={currentUserNickname}
              />
            )}
          />
        </InfiniteScroll>
      </div>
    </BasicLayout>
  );
};

export default PostListPage;
