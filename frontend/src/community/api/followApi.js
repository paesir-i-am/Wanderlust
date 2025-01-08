import axiosInstance from "../../common/api/mainApi";
import { getCookie } from "../../common/util/cookieUtil"; // 쿠키 유틸 사용

// 로그인 여부 확인 함수
const isLoggedIn = () => {
  const accessToken = getCookie("accessToken");
  return !!accessToken;
};

// 팔로우 요청
export const followUser = async (nickname) => {
  if (!isLoggedIn()) return Promise.reject(new Error("User not logged in"));
  try {
    const response = await axiosInstance.post(`/community/follow/${nickname}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to follow user ${nickname}:`, error);
    throw error;
  }
};

// 언팔로우 요청
export const unfollowUser = async (nickname) => {
  if (!isLoggedIn()) return Promise.reject(new Error("User not logged in"));
  try {
    const response = await axiosInstance.delete(
      `/community/follow/${nickname}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to unfollow user ${nickname}:`, error);
    throw error;
  }
};

// 팔로우 상태 확인
export const checkFollowStatus = async (nickname) => {
  if (!isLoggedIn()) return false;
  try {
    const response = await axiosInstance.get(
      `/community/follow/status/${nickname}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to check follow status for ${nickname}:`, error);
    throw error;
  }
};

// 팔로워 수 가져오기
export const fetchFollowerCount = async (nickname) => {
  try {
    const response = await axiosInstance.get(
      `/community/follow/${nickname}/count`,
    );
    return response.data.followers;
  } catch (error) {
    console.error(`Failed to fetch follower count for ${nickname}:`, error);
    throw error;
  }
};

// 팔로잉 수 가져오기
export const fetchFollowingCount = async (nickname) => {
  try {
    const response = await axiosInstance.get(
      `/community/follow/${nickname}/count`,
    );
    return response.data.following;
  } catch (error) {
    console.error(`Failed to fetch following count for ${nickname}:`, error);
    throw error;
  }
};

// 팔로워 목록 가져오기
export const fetchFollowers = async (nickname, page = 0, size = 10) => {
  if (!isLoggedIn()) return Promise.resolve([]);
  try {
    const response = await axiosInstance.get(
      `/community/follow/followers/${nickname}`,
      {
        params: { page, size },
      },
    );
    return response.data.content || response.data;
  } catch (error) {
    console.error(`Failed to fetch followers for ${nickname}:`, error);
    throw error;
  }
};

// 팔로잉 목록 가져오기
export const fetchFollowing = async (nickname, page = 0, size = 10) => {
  if (!isLoggedIn()) return Promise.resolve([]);
  try {
    const response = await axiosInstance.get(
      `/community/follow/following/${nickname}`,
      {
        params: { page, size },
      },
    );
    return response.data.content || response.data;
  } catch (error) {
    console.error(`Failed to fetch following for ${nickname}:`, error);
    throw error;
  }
};
