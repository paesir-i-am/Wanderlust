import React, { useState } from "react";
import { useCustomLogin } from "../hook/useCustomLogin";
import "./scss/LoginForm.css";
import { Link } from "react-router-dom";
import naverLogin from "../img/naver_login.png";
import kakaoLogin from "../img/kakao_login.png";
import googleLogin from "../img/google_login.png";

const initState = {
  email: "",
  pw: "",
};

const LoginForm = () => {
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
          window.close(); // 팝업 창 닫기
        } else {
          throw new Error("응답에 토큰이 포함되지 않았습니다.");
        }
        alert("로그인 성공");
        moveToPath("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>로그인</h1>
      <div className="social-icons">
        <Link to="#" className="icon">
          <img src={kakaoLogin} alt="kakao" className="fa-brands fa-kakao-k" />
        </Link>
        <Link to="#" className="icon">
          <img src={naverLogin} alt="naver" className="fa-brands fa-naver-n" />
        </Link>
        <Link to="#" className="icon">
          <img
            src={googleLogin}
            alt="google"
            className="fa-brands fa-google-g"
          />
        </Link>
      </div>
      <div className="use-email">or use your email password</div>
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={loginParam.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />
      <div className="warning">
        {loginParam.pw &&
          loginParam.pw.length < 8 &&
          "비밀번호는 8자리 이상이여야 합니다"}
      </div>
      <input
        type="password"
        name="pw"
        placeholder="비밀번호"
        value={loginParam.pw}
        onChange={handleChange}
        required
        autoComplete="current-password"
      />
      <a href="#">Forget Your Password?</a>
      <br />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;
