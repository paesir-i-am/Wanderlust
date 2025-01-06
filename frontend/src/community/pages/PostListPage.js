import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";
import PostForm from "../component/post/PostForm";
import PostList from "../component/post/PostList";
import { deletePost, fetchPosts, updatePost } from "../api/postApi";
import "./scss/PostListPage.css";
import { useNavigate } from "react-router-dom";
import { fetchFollowers, fetchFollowing } from "../api/followApi";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [followers, setFollowers] = useState([]); // 팔로워 리스트 상태
  const [following, setFollowing] = useState([]); // 팔로잉 리스트 상태
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(true);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);

  const currentUserNickname = useSelector((state) => state.loginSlice.nickname);
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate(`/community/profile/${currentUserNickname}`);
  };

  const getFullImageUrl = (imageUrl) => {
    const BASE_URL = "http://localhost:8080";
    return imageUrl
      ? `${BASE_URL}${imageUrl}`
      : `${BASE_URL}/backend/uploads/default-profile.gif`;
  };

  // 팔로워 및 팔로잉 리스트 로드
  useEffect(() => {
    const loadFollowLists = async () => {
      try {
        const followersData = await fetchFollowers(currentUserNickname);
        const followingData = await fetchFollowing(currentUserNickname);

        setFollowers(followersData);
        setFollowing(followingData);
      } catch (error) {
        console.error("Failed to load follow lists:", error);
      } finally {
        setIsLoadingFollowers(false);
        setIsLoadingFollowing(false);
      }
    };

    loadFollowLists();
  }, [currentUserNickname]);

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
      <div className="post-list-page">
        {/* 왼쪽 80% */}
        <div className="post-list-page__main" id="scrollableDiv">
          <div className="post-list-page__main__post-form">
            <PostForm />
          </div>
          <div className="post-list-page__main__post-list">
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
              />
            </InfiniteScroll>
          </div>
        </div>
        {/* 오른쪽 20% */}
        <div className="post-list-page__sidebar">
          <div className="profile-link" onClick={handleNavigateToProfile}>
            <h3>👤 {currentUserNickname}</h3>
          </div>

          {/* 팔로워 리스트 */}
          <div className="post-list-page__sidebar__follow-list">
            <h3>Followers</h3>
            {isLoadingFollowers ? (
              <p>Loading followers...</p>
            ) : followers.length > 0 ? (
              <ul>
                {followers.map((follower) => (
                  <li key={follower.nickname}>
                    <img
                      src={getFullImageUrl(follower.profileImageUrl)}
                      alt={`${follower.nickname}'s profile`}
                      className="profile-image"
                    />
                    <span>{follower.nickname}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No followers available.</p>
            )}
          </div>

          {/* 팔로잉 리스트 */}
          <div className="post-list-page__sidebar__follow-list">
            <h3>Following</h3>
            {isLoadingFollowing ? (
              <p>Loading following...</p>
            ) : following.length > 0 ? (
              <ul>
                {following.map((follow) => (
                  <li key={follow.nickname}>
                    <img
                      src={getFullImageUrl(follow.profileImageUrl)}
                      alt={`${follow.nickname}'s profile`}
                      className="profile-image"
                    />
                    <span>{follow.nickname}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No following available.</p>
            )}
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default PostListPage;
