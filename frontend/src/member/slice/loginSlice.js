import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost, registerPost } from "../api/memberApi";
import {
  getCookie,
  removeCookie,
  setCookie,
} from "../../common/util/cookieUtil";
import axios from "axios";

// 초기 상태
const initState = {
  accessToken: null,
  refreshToken: null,
  email: "",
  nickname: "",
  roleNames: [],
  loginSuccess: false, // 로그인 성공 여부 추가
};

// 쿠키에서 사용자 정보 로드
const loadMemberCookie = () => {
  try {
    const memberInfo = getCookie("member");
    return memberInfo ? JSON.parse(memberInfo) : null;
  } catch (error) {
    console.error("Failed to parse member cookie:", error);
    return null;
  }
};

// 회원가입 API 호출 비동기 작업
export const registerPostAsync = createAsyncThunk(
  "registerPostAsync",
  async (registerParam) => {
    const res = await registerPost(registerParam);
    return res;
  },
);

// 로그인 API 호출 비동기 작업
export const loginPostAsync = createAsyncThunk(
  "loginPostAsync",
  async (param) => {
    const response = await loginPost(param);
    return response;
  },
);

// Slice 생성
const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie() || initState, // 쿠키 데이터가 없으면 초기 상태
  reducers: {
    login: (state, action) => {
      console.log("login...");

      // Redux 상태 업데이트
      const payload = action.payload;
      state.email = payload.email;
      state.nickname = payload.nickname;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.roleNames = payload.roleNames;
      state.loginSuccess = true; // 로그인 성공 상태 설정

      // 쿠키에 저장
      setCookie("member", JSON.stringify(payload), {
        path: "/",
        maxAge: 86400,
      }); // 1일
      setCookie("accessToken", payload.accessToken, {
        maxAge: 86400,
      });
      setCookie("refreshToken", payload.refreshToken, {
        maxAge: 86400,
      });
    },

    logout: (state) => {
      console.log("logout...");
      // 상태 초기화
      Object.assign(state, initState);

      // 쿠키 삭제
      removeCookie("member", { path: "/" });
      removeCookie("accessToken");
      removeCookie("refreshToken");
    },

    loginSuccess: (state) => {
      state.loginSuccess = true;
    },

    loginFailure: (state) => {
      state.loginSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log("fulfilled"); // 완료
        const payload = action.payload;

        if (!payload.error) {
          // Redux 상태 업데이트
          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
          state.email = payload.email;
          state.nickname = payload.nickname;
          state.roleNames = payload.roleNames;
          state.loginSuccess = true; // 로그인 성공 상태 설정

          // 쿠키에 저장
          setCookie("member", JSON.stringify(payload), {
            path: "/",
            maxAge: 86400,
          });
          setCookie("accessToken", payload.accessToken, {
            maxAge: 86400,
          });
          setCookie("refreshToken", payload.refreshToken, {
            maxAge: 86400,
          });
        }
      })
      .addCase(loginPostAsync.pending, () => {
        console.log("pending"); // 처리 중
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected", action.error); // 에러
        state.loginSuccess = false; // 로그인 실패 상태 설정
      })
      .addCase(registerPostAsync.fulfilled, (state, action) => {
        console.log("회원가입 완료 : " + action.payload);
      })
      .addCase(registerPostAsync.rejected, (state, action) => {
        console.log("회원가입 실패 : " + action.error.message);
      });
  },
});

// 액션과 리듀서 내보내기
export const { login, logout, loginSuccess, loginFailure } = loginSlice.actions;
export default loginSlice.reducer;
