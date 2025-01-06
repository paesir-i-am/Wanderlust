import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // 공통 base URL
  headers: { "Content-Type": "application/json" },
});

// 항공권 검색 API 호출
export const searchFlights = async (payload) => {
  try {
    const response = await apiClient.post("/search", payload);
    return response.data; // 서버에서 받은 데이터 반환
  } catch (error) {
    console.error("Flight search failed:", error);
    throw error.response?.data?.message || "API 요청 중 문제가 발생했습니다.";
  }
};
