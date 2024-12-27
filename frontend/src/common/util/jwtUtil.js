import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/mainApi";

/* 리프레시 토큰 재발행 */
export const refreshJWT = async () => {
  const host = API_SERVER_HOST;

  const res = await axios.post(
    `${host}/member/refresh`,
    {},
    {
      headers: { "Refresh-Token": getCookie("refreshToken") },
      withCredentials: true,
    },
  );
  console.log(res.data);

  setCookie("accessToken", res.data.accessToken, {
    path: "/",
    maxAge: res.data.maxAge,
  });

  return res.data;
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
