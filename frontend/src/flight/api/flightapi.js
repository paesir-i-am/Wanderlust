import axios from "axios";

// Spring Boot 서버용 Axios 인스턴스
const springApi = axios.create({
  baseURL: "http://127.0.0.1:8080/flight/result", // Spring Boot 서버의 base URL
  headers: { "Content-Type": "application/json" },
});

// 모든 Flight 데이터를 가져오는 함수
export const getAllFlightData = async () => {
  try {
    const response = await springApi.get(""); // GET 요청으로 데이터 가져오기
    return response.data; // 서버에서 반환된 데이터
  } catch (error) {
    console.error("Error fetching all flight data:", error);
    throw error;
  }
};
