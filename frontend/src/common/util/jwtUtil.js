import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/mainApi";

const jwtAxios = axios.create();

const refreshJWT = async (refreshToken) => {
  const host = API_SERVER_HOST;

  const header = { headers: { "Refresh-Token": getCookie("refreshToken") } };

  const res = await axios.get(
    `${host}/member/refresh?refreshToken=${refreshToken}`,
    header,
  );

  console.log("----------------------");
  console.log(res.data);

  return res.data;
};

//before request
const beforeReq = (config) => {
  console.log("before request.............");

  const memberInfo = getCookie("member");

  if (!memberInfo) {
    console.log("Member NOT FOUND");
    return Promise.reject({ response: { data: { error: "REQUIRE_LOGIN" } } });
  }

  const { accessToken } = JSON.parse(memberInfo);

  // Authorization (허가)헤더 처리
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

//fail request
const requestFail = (err) => {
  console.log("request error............");

  return Promise.reject(err);
};

//before return response
const beforeRes = async (res) => {
  console.log("before return response...........");

  console.log(res);

  //'ERROR_ACCESS_TOKEN'
  const data = res.data;

  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberInfo = JSON.parse(getCookie("member"));
    const { accessToken, refreshToken } = memberInfo;

    const result = await refreshJWT(accessToken, refreshToken);

    memberInfo.accessToken = result.accessToken;
    memberInfo.refreshToken = result.refreshToken;

    setCookie("member", JSON.stringify(memberInfo), {
      path: "/",
      maxAge: 86400,
    });

    //갱신된 토큰들을 다시 저장하고 원래 원했던 호출을 다시 시도하는 작업을 추가한다.
    const originalRequest = res.config;

    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

    return axios(originalRequest);
  }

  return res;
};

//fail response
const responseFail = (err) => {
  console.log("response fail error.............");
  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);

jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
