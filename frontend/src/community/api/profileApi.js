import axiosInstance from "../../common/api/mainApi";

// 프로필 정보 가져오기
export const fetchProfile = async (nickname) => {
  try {
    const response = await axiosInstance.get(`/community/profile/${nickname}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch profile for ${nickname}:`, error);
    throw error;
  }
};

// 프로필 업데이트
export const updateProfile = async (nickname, formData) => {
  try {
    const response = await axiosInstance.post(
      `/community/profile/${nickname}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    window.location.reload();
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

// 프로필 삭제
export const deleteProfile = async (nickname) => {
  try {
    const response = await axiosInstance.delete(
      `/community/profile/${nickname}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to delete profile for ${nickname}:`, error);
    throw error;
  }
};
