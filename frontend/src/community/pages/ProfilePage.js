import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "../component/profile/ProfileInfo";
import ProfilePostSection from "../component/profile/ProfilePostSection";
import PostDetailModal from "../component/profile/PostDetailModal";
import { fetchProfile, updateProfile } from "../api/profileApi";
import { deletePost, fetchPostsByNickname, updatePost } from "../api/postApi";
import {
  fetchFollowerCount,
  fetchFollowingCount,
  fetchFollowers,
  fetchFollowing,
} from "../api/followApi";
import FollowListModal from "../component/profile/FollowListModal";
import "./scss/ProfilePage.css";
import BasicLayout from "../../common/layout/basicLayout/BasicLayout";

const ProfilePage = () => {
  const { nickname } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 모달 상태 관리
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "followers" 또는 "following"
  const [modalList, setModalList] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false); // 디테일 모달 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 포스트 데이터

  // 프로필 로드
  const loadProfile = async () => {
    try {
      const data = await fetchProfile(nickname);
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  // 팔로우 데이터 로드
  const loadFollowCounts = async () => {
    try {
      const followers = await fetchFollowerCount(nickname);
      const following = await fetchFollowingCount(nickname);
      setFollowerCount(followers);
      setFollowingCount(following);
    } catch (error) {
      console.error("Failed to load follow counts:", error);
    }
  };

  // 포스트 로드
  const loadPosts = async () => {
    try {
      const data = await fetchPostsByNickname(nickname, page);
      setPosts((prevPosts) => [...prevPosts, ...data.content]);
      setHasMore(!data.last);
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  };

  // 프로필 업데이트
  const handleProfileUpdate = async (nickname, formData) => {
    try {
      await updateProfile(nickname, formData);
      alert("프로필이 성공적으로 업데이트되었습니다.");
      loadProfile();
      loadFollowCounts();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("프로필 업데이트 중 문제가 발생했습니다.");
    }
  };

  // 포스트 무한스크롤
  const loadMorePosts = async () => {
    try {
      const data = await fetchPostsByNickname(nickname, page);
      setPosts((prevPosts) => {
        const allPosts = [...prevPosts, ...data.content];
        const uniquePosts = Array.from(
          new Map(allPosts.map((post) => [post.id, post])).values(),
        );
        return uniquePosts;
      });
      setPage((prevPage) => prevPage + 1);
      setHasMore(!data.last);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    }
  };

  // 팔로워 모달 열기
  const handleShowFollowers = async () => {
    try {
      const data = await fetchFollowers(nickname);
      setModalType("followers");
      setModalList(data || []);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load followers:", error);
      setModalList([]);
    }
  };

  // 팔로잉 모달 열기
  const handleShowFollowing = async () => {
    try {
      const data = await fetchFollowing(nickname);
      setModalType("following");
      setModalList(data || []);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load following:", error);
      setModalList([]);
    }
  };

  // 디테일 모달 열기
  const handleShowPostModal = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  // 디테일 모달 닫기
  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  // 포스트 수정 완료 후 리프레시
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

  // 페이지가 바뀔 때마다 프로필, 팔로우, 포스트 로드
  useEffect(() => {
    loadProfile();
    loadFollowCounts();
    loadPosts();
  }, [nickname, page]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <BasicLayout>
      <div className="profile-page">
        <ProfileInfo
          profile={profile}
          followerCount={followerCount}
          followingCount={followingCount}
          onProfileUpdate={handleProfileUpdate}
          onEditStart={() => console.log("Editing started!")}
          onEditCancel={() => console.log("Editing canceled!")}
          onShowFollowers={handleShowFollowers}
          onShowFollowing={handleShowFollowing}
        />
        <ProfilePostSection
          posts={posts}
          onPostClick={handleShowPostModal}
          loadMorePosts={loadMorePosts}
          hasMore={hasMore}
        />
        {hasMore && (
          <button
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="load-more-btn"
          >
            Load More
          </button>
        )}
        {showModal && (
          <FollowListModal
            type={modalType}
            list={modalList}
            onClose={() => setShowModal(false)}
          />
        )}
        {showPostModal && selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={handleClosePostModal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default ProfilePage;
