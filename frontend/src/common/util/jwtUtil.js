import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/mainApi";

/* 리프레시 토큰 재발행 */
export const refreshJWT = async () => {
  const host = API_SERVER_HOST;

  // 쿠키에서 refreshToken 가져오기
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) {
    console.warn("Refresh token is missing. Skipping token refresh.");
    return null; // 또는 적절한 처리
  }

  try {
    const res = await axios.post(
      `${host}/member/refresh`,
      {},
      {
        headers: { "Refresh-Token": refreshToken },
        withCredentials: true,
      },
    );

    // 응답 데이터 검증
    if (!res.data || !res.data.accessToken || !res.data.maxAge) {
      console.error("Invalid response format during token refresh:", res.data);
      return null;
    }

    // 새 accessToken 쿠키에 저장
    setCookie("accessToken", res.data.accessToken, {
      path: "/",
      maxAge: res.data.maxAge,
    });

    console.log("JWT successfully refreshed:", res.data.accessToken);

    return res.data;
  } catch (err) {
    console.error("Failed to refresh JWT:", err);
    return null; // 오류 발생 시 null 반환
  }
};
/* Axios 요청 인터셉터 */
export const addAuthHeader = (config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

/* Axios 응답 인터셉터
 *  토큰 갱신 처리할 때 사용*/
export const handleAuthError = async (err) => {
  const originalRequest = err.config;

  if (err.response && err.response.status === 401) {
    originalRequest.retry = true;
  }

  try {
    const newAccessToken = await refreshJWT();
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return axios(originalRequest);
  } catch (error) {
    console.log("failed to retry request after refreshing JWT : " + error);
    throw error;
  }
  throw err;
};

export default { addAuthHeader, handleAuthError };
