import React, { useState } from "react";
import "./scss/RegisterForm.css";
import { Link } from "react-router-dom";
import kakaoLogin from "../img/kakao_login.png";
import naverLogin from "../img/naver_login.png";
import googleLogin from "../img/google_login.png";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Attempt:", { name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h1>회원가입</h1>
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
      <div className="use-email">or use your email for registration</div>
      <input
        type="text"
        placeholder="닉네임을 입력해주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="이메일을 입력해주세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/*<div className="warning">
        {loginParam.pw &&
          loginParam.pw.length < 8 &&
          "비밀번호는 8자리 이상이여야 합니다"}
      </div>*/}
      <input
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default RegisterForm;
