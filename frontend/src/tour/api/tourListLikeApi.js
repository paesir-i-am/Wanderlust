import axiosInstance from "../../common/api/mainApi";

const BASE_URL = "/tour"; // baseURL이 이미 설정되어 있으므로 '/tour'만 사용
const base = `${BASE_URL}/like`;

export const tourListLikeApi = {
  /**
   * 좋아요된 여행지 리스트 조회
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>} - 좋아요된 여행지 리스트
   */
  getLikedTours: async (userId) => {
    try {
      const response = await axiosInstance.get(base, {
        params: { userId },
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching liked tours:", error);
      throw error;
    }
  },

  /**
   * 여행지 좋아요 추가
   * @param {string} userId - 사용자 ID
   * @param {number} tourId - 여행지 ID
   * @returns {Promise<string>} - 성공 메시지
   */
  likeTour: async (userId, tourId) => {
    try {
      const response = await axiosInstance.post(base, null, {
        params: { userId, tourId },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error liking tour:", error);
      throw error;
    }
  },

  /**
   * 여행지 좋아요 삭제
   * @param {string} userId - 사용자 ID
   * @param {number} tourId - 여행지 ID
   * @returns {Promise<string>} - 성공 메시지
   */
  unlikeTour: async (userId, tourId) => {
    try {
      const response = await axiosInstance.delete(base, {
        params: { userId, tourId },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error unliking tour:", error);
      throw error;
    }
  },
};
