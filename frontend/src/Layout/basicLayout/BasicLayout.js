import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./basicLayout.css";

const BasicLayout = ({ children }) => {
  const [activeOption, setActiveOption] = useState("왕복"); // 초기 활성화 상태

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  return (
    <div className="basic-layout">
      {/* 상단 헤더 */}
      <header>
        <div className="header-overlay">
          <div className="header-top">
            <div className="logo">
              <Link to="/">
                <img src="/wanderlustLogoHeader.svg" alt="Wanderlust Logo" />
              </Link>
            </div>
            <div className="searchbar">
              <input
                type="text"
                placeholder="Search your Memory, will craft moments of now Ones.."
                className="search-input"
              />
              <div className="search-buttons">
                <button>
                  <img src="/icons/picturSearchIcon.svg" alt="Picture Search" />
                </button>
                <button>
                  <img src="/icons/searchIcon.svg" alt="Search" />
                </button>
              </div>
            </div>
            <div className="icons">
              <button>
                <img src="/icons/notification.svg" alt="Notifications" />
              </button>
              <button>
                <img src="/icons/reservation.svg" alt="Reservations" />
              </button>
              <button>
                <img src="/icons/login.svg" alt="Login" />
              </button>
            </div>
          </div>
          <nav className="nav">
            <Link to="/">전체메뉴</Link>
            <Link to="/flight">항공권</Link>
            <Link to="/photo-search">사진검색</Link>
            <Link to="/community">커뮤니티</Link>
            <Link to="/flight-info">항공정보</Link>
          </nav>
        </div>
      </header>

      {/* 검색 섹션 */}
      <div className="search">
        <div className="options">
          {["왕복", "편도", "다구간"].map((option) => (
            <button
              key={option}
              className={activeOption === option ? "active" : ""}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="fields">
          <input type="text" placeholder="출발지 선택" />
          <span>⇌</span>
          <input type="text" placeholder="도착지 선택" />
          <input type="date" />
          <input type="date" />
          <select>
            <option>승객1, 일반석</option>
          </select>
          <button>검색</button>
        </div>
      </div>

      {/* 본문 콘텐츠 */}
      <main className="content">{children}</main>
    </div>
  );
};

export default BasicLayout;
