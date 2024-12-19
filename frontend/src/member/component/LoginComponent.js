import React, { useState } from "react";
import { useCustomLogin } from "../hook/useCustomLogin";
import "./LoginPage.css";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const [error, setError] = useState(""); // 에러 상태 관리
  const { doLogin, moveToPath } = useCustomLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginParam((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await doLogin({
        email: loginParam.email,
        pw: loginParam.pw,
      });

      if (window.opener) {
        if (response?.accessToken) {
          const targetOrigin = window.location.origin; // 보안 강화를 위해 origin 명시
          window.opener.postMessage(
            {
              type: "LOGIN_SUCCESS",
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            },
            targetOrigin,
          );
          console.log("로그인 메시지 전송 성공");
          window.close(); // 팝업 창 닫기 (필요 시 주석 제거)
        } else {
          throw new Error("응답에 토큰이 포함되지 않았습니다.");
        }
        alert("로그인 성공");
        moveToPath("/");
      } else {
        // alert("로그인 성공");
        // moveToPath("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={loginParam.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="pw"
            placeholder="비밀번호"
            value={loginParam.pw}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="login-links">
          <a href="/register">회원가입</a>
          <a href="/forgot-password">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
