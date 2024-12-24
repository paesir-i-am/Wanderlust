import React, { useState } from "react";
import "./scss/RegisterForm.css";
import { Link } from "react-router-dom";
import kakaoLogin from "../img/kakao_login.png";
import naverLogin from "../img/naver_login.png";
import googleLogin from "../img/google_login.png";
import { useCustomLogin } from "../hook/useCustomLogin";
import { checkEmailDuplicate } from "../api/memberApi";

const initState = {
  email: "",
  nickname: "",
  pw: "",
};

const RegisterForm = () => {
  const [registerParam, setRegisterParam] = useState({ ...initState });
  const [error, setError] = useState(""); //에러 상태 관리
  const [emailError, setEmailError] = useState(""); //이메일 중복 에러 메세지
  const [isEmailValid, setIsEmailValid] = useState(false); //이메일 유효 여부
  const { doRegister, moveToLogin } = useCustomLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterParam((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setIsEmailValid(false); //이메일 입력 시 유효성 초기화
      setEmailError(""); //이메일 에러 초기화
    }
  };

  const handleEmailCheck = async () => {
    // 이메일 형식 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 이메일 형식 검증
    if (!emailRegex.test(registerParam.email)) {
      setIsEmailValid(false);
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const isDuplicate = await checkEmailDuplicate(registerParam.email);
      if (isDuplicate) {
        setIsEmailValid(false);
        setEmailError("이미 사용 중인 이메일입니다.");
      } else {
        setIsEmailValid(true);
        setEmailError("사용 가능한 이메일입니다.");
      }
    } catch (e) {
      console.log(e);
      setEmailError("이메일 중복 확인 중 문제가 발생하였습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("이메일 중복 확인을 해주세요");
      return;
    }

    if (registerParam.pw.length < 8) {
      setError("비밀번호는 8자리 이상이어야 합니다.");
      return;
    }

    try {
      const response = await doRegister(registerParam);
      alert("회원가입 성공");
      console.log("회원가입 성공 : " + response);
      moveToLogin();
    } catch (err) {
      console.log("회원가입 실패 : " + err);
      setError("회원가입에 실패했습니다. 입력 정보를 확인해주세요");
    }
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
      <div className="email-check">
        <input
          type="email"
          name="email"
          placeholder="이메일을 입력해주세요"
          value={registerParam.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <button
          type="button"
          onClick={handleEmailCheck}
          disabled={!registerParam.email}
        >
          중복 확인
        </button>
      </div>
      <div className="warning">
        {emailError && (
          <p style={{ color: isEmailValid ? "green" : "red" }}>{emailError}</p>
        )}
      </div>
      <input
        type="text"
        name="nickname"
        placeholder="닉네임을 입력해주세요"
        value={registerParam.name}
        onChange={handleChange}
        required
      />
      <div className="warning">
        {registerParam.pw &&
          registerParam.pw.length < 8 &&
          "비밀번호는 8자리 이상이여야 합니다"}
      </div>
      <input
        type="password"
        name="pw"
        placeholder="비밀번호를 입력해주세요"
        value={registerParam.pw}
        onChange={handleChange}
        minLength={8}
        required
        autoComplete="new-password"
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">회원가입</button>
    </form>
  );
};

export default RegisterForm;
