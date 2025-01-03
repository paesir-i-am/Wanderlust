import React, { useState, useEffect } from "react";
import { followUser, unfollowUser, checkFollowStatus } from "../api/followApi";
import { getCookie } from "../../common/util/cookieUtil";
import "./scss/FollowButton.css";

const FollowButton = ({ targetNickname }) => {
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 로그인 상태 확인
  const isLoggedIn = !!getCookie("accessToken");

  // 초기 상태 확인 및 설정
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false); // 로그인되지 않은 경우 로딩 종료
      return;
    }

    const fetchFollowStatus = async () => {
      try {
        const status = await checkFollowStatus(targetNickname); // API 호출
        setIsFollowing(status); // 상태 설정
      } catch (error) {
        console.error("Failed to fetch follow status:", error);
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    };

    fetchFollowStatus();
  }, [targetNickname, isLoggedIn]);

  // 팔로우 처리
  const handleFollow = async () => {
    try {
      setIsLoading(true);
      await followUser(targetNickname);
      setIsFollowing(true); // 팔로우 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 언팔로우 처리
  const handleUnfollow = async () => {
    try {
      setIsLoading(true);
      await unfollowUser(targetNickname);
      setIsFollowing(false); // 팔로우 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인되지 않은 경우 버튼을 렌더링하지 않음
  if (!isLoggedIn) {
    return null;
  }

  // 로딩 중일 때 버튼 비활성화
  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  return (
    <button
      className={`follow-button ${isLoading ? "loading" : ""} ${
        isFollowing ? "following" : ""
      }`}
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
