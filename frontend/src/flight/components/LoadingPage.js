// src/components/LoadingPage.js
import React from "react";
import "../styles/LoadingPage.scss"; // 로딩 애니메이션 스타일

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>항공권을 검색 중입니다...</p>
    </div>
  );
};

export default LoadingPage;
