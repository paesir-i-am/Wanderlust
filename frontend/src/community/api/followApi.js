import axiosInstance from "../../common/api/mainApi";

// 팔로우 요청
export const followUser = async (nickname) => {
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

// 팔로워 목록 가져오기
export const getFollowers = async () => {
  try {
    const response = await axiosInstance.get("/community/follow/followers");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    throw error;
  }
};

// 팔로잉 목록 가져오기
export const getFollowings = async () => {
  try {
    const response = await axiosInstance.get("/community/follow/followings");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch followings:", error);
    throw error;
  }
};

// 팔로우 상태 확인
export const checkFollowStatus = async (nickname) => {
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
