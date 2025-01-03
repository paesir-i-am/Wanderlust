import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "../component/profile/ProfileInfo";
import ProfilePostSection from "../component/profile/ProfilePostSection";
import { fetchProfile, updateProfile } from "../api/profileApi";
import { fetchPostsByNickname } from "../api/postApi";
import { fetchFollowerCount, fetchFollowingCount } from "../api/followApi";
import "./scss/ProfilePage.css";

const ProfilePage = () => {
  const { nickname } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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
      loadProfile(); // 프로필 재로드
      loadFollowCounts(); // 팔로우 데이터 재로드
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("프로필 업데이트 중 문제가 발생했습니다.");
    }
  };

  // 수정 시작 핸들러
  const handleEditStart = () => {
    console.log("Editing started!");
  };

  useEffect(() => {
    loadProfile();
    loadFollowCounts();
    loadPosts();
  }, [nickname, page]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      <ProfileInfo
        profile={profile}
        followerCount={followerCount}
        followingCount={followingCount}
        onProfileUpdate={handleProfileUpdate}
        onEditStart={handleEditStart} // onEditStart 전달
        onShowFollowers={() => console.log("Show followers modal")}
        onShowFollowing={() => console.log("Show following modal")}
      />
      <ProfilePostSection
        posts={posts}
        onPostClick={(post) => console.log("Post clicked:", post)}
      />
      {hasMore && (
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="load-more-btn"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
