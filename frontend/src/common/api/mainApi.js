import axios from "axios";
import { getCookie, setCookie } from "../util/cookieUtil";

export const API_SERVER_HOST = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_SERVER_HOST,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 포함하여 전송
});

// 요청 인터셉터에서 Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Authorization Header:", config.headers.Authorization);
    } else {
      console.log("Access token not found in cookies.");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;

      // Refresh Token 요청
      try {
        const { data } = await axios.post(
          `${API_SERVER_HOST}/member/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              "Refresh-Token": getCookie("refreshToken"),
            },
          },
        );
        setCookie("accessToken", data.accessToken, {
          path: "/",
          maxAge: data.maxAge,
        });

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // 실패한 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
