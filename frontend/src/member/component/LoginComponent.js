import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./scss/LoginPage.css";

const LoginComponent = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleAuthMode = () => {
    setIsLoginMode((prev) => !prev);
  };

  return (
    <div
      className={`auth-container ${isLoginMode ? "loginMode" : "sign-up-mode"}`}
    >
      {/* 로그인 폼 */}
      <LoginForm
        isLogin={isLoginMode}
        className="sign-in-container sign-form"
      />

      {/* 회원가입 폼 */}
      <RegisterForm
        isLogin={isLoginMode}
        className="sign-up-container sign-form"
      />

      {/* 오버레이 */}
      <div className="overlay-container">
        <div className="overlay">
          {/* 왼쪽 패널 */}
          {isLoginMode ? (
            <div className="overlay-panel overlay-left">
              <h1>여행은 꿈꾸는 시간부터 시작됩니다.</h1>
              <p>지금 함께 떠날 준비를 해볼까요?</p>
              <button onClick={toggleAuthMode} className="ghost" type="button">
                회원가입
              </button>
            </div>
          ) : (
            <div className="overlay-panel overlay-left">
              <h2>다시 만나서 반가워요!</h2>
              <p>함께 새로운 여정을 시작해요.</p>
              <button onClick={toggleAuthMode} className="ghost" type="button">
                로그인하기
              </button>
            </div>
          )}

          {/* 오른쪽 패널 */}
          {isLoginMode ? (
            <div className="overlay-panel overlay-right">
              <h1>여행은 꿈꾸는 시간부터 시작됩니다.</h1>
              <p>지금 함께 떠날 준비를 해볼까요?</p>
              <button onClick={toggleAuthMode} className="ghost" type="button">
                회원가입
              </button>
            </div>
          ) : (
            <div className="overlay-panel overlay-right">
              <h2>다시 만나서 반가워요!</h2>
              <p>함께 새로운 여정을 시작해요.</p>
              <button onClick={toggleAuthMode} className="ghost" type="button">
                로그인하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
