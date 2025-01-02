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
export const updateProfile = async (
  nickname,
  profileData,
  profileImage,
  token,
) => {
  const formData = new FormData();
  formData.append("bio", profileData.bio); // 프로필 소개
  if (profileImage) {
    formData.append("profileImage", profileImage); // 이미지 파일
  }

  try {
    const response = await axiosInstance.post(
      `/community/profile/${nickname}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update profile for ${nickname}:`, error);
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
