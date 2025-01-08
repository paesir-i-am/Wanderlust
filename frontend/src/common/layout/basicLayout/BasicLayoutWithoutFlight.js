import React, { useState } from "react";
import { useCustomLogin } from "../../../member/hook/useCustomLogin";
import { Link } from "react-router-dom";
import "./basicLayout.css";
import FlightSearch from "../../../flight/components/FlightSearch";
import NotificationIcon from "../../../notification/component/NotificationIcon";
import NotificationDropdown from "../../../notification/component/NotificationDropdown";

const BasicLayout = ({ children }) => {
  const [activeOption, setActiveOption] = useState("왕복"); // 초기 활성화 상태
  const [menuActive, setMenuActive] = useState(false); // 모바일 메뉴 상태
  const [showSearch, setShowSearch] = useState(false); // 모바일 검색창 상태
  const [showFlightSearch, setShowFlightSearch] = useState(false);

  const { isLogin, moveToLogin, doLogout, moveToPath, doLoginPopup } =
    useCustomLogin();

  const toggleFlightSearch = () => {
    setShowFlightSearch((prev) => !prev);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const handleNotificationClick = () => setShowDropdown((prev) => !prev);

  return (
    <div className="basic-layout">
      {/* 상단 헤더 */}
      <header className="header-fixed">
        <div className="header-overlay">
          <div className="header-top">
            <div className="logo">
              <Link to="/">
                <img src="/wanderlustHeadLogo.svg" alt="Wanderlust Logo" />
              </Link>
            </div>

            {/* 데스크탑 검색창 */}
            <div className="searchbar desktop-only">
              <input
                type="text"
                placeholder="Search your Memory, will craft moments of now Ones.."
                className="search-input"
              />
              <div className="search-buttons">
                <button>
                  <img src="/icons/picturSearchIcon.svg" alt="PictureSearch" />
                </button>
                <button>
                  <img src="/icons/searchIcon.svg" alt="Search" />
                </button>
              </div>
            </div>

            {/* 모바일/태블릿 검색창 */}
            {showSearch && (
              <div className="searchbar mobile-only">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search your Memory, will craft moments of now Ones.."
                />
                <div className="search-buttons mobile-only">
                  <button>
                    <img src="/icons/searchIcon.svg" alt="검색" />
                  </button>
                </div>
              </div>
            )}

            {/* 아이콘 버튼 */}
            <div className="icons desktop-only">
              <div style={{ position: "relative", zIndex: 9999 }}>
                <NotificationIcon onClick={handleNotificationClick} />
                {showDropdown && (
                  <NotificationDropdown
                    onClose={() => setShowDropdown(false)}
                  />
                )}
              </div>
              <button>
                <img src="/icons/reservation.svg" alt="Reservations" />
              </button>
              {isLogin ? (
                <button onClick={doLogout}>
                  <img src="/icons/logout.svg" alt="Logout" />
                </button>
              ) : (
                <button onClick={doLoginPopup}>
                  <img src="/icons/login.svg" alt="Login" />
                </button>
              )}
            </div>
          </div>

          {/* 데스크탑 메뉴 */}
          <nav className="nav desktop-only">
            <Link to="/">전체메뉴</Link>
            <Link to="#" onClick={toggleFlightSearch}>
              항공권
            </Link>
            <Link to="/photo-search">사진검색</Link>
            <Link to="/community">커뮤니티</Link>
            <Link to="/flight-info">항공정보</Link>
          </nav>
        </div>

        {/* 검색 섹션 */}
        {showFlightSearch && (
          <div className="search mobile-only">
            <FlightSearch
              activeOption={activeOption}
              setActiveOption={setActiveOption}
            />
          </div>
        )}
      </header>

      {/* 본문 콘텐츠 */}
      <main className="content">{children}</main>

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav mobile-only">
        <button onClick={() => setMenuActive(!menuActive)}>
          <img src="/icons/menu.svg" alt="메뉴" />
        </button>
        <button onClick={() => setShowSearch(!showSearch)}>
          <img src="/icons/searchIcon.svg" alt="검색" />
        </button>
        <button onClick={() => moveToPath("/")}>
          <img src="/icons/home.svg" alt="홈" />
        </button>
        {isLogin ? (
          <button onClick={doLogout}>
            <img src="/icons/loginMobile.svg" alt="로그아웃" />
          </button>
        ) : (
          <button onClick={moveToLogin}>
            <img src="/icons/loginMobile.svg" alt="로그인" />
          </button>
        )}
      </nav>

      {/* 모바일 메뉴 모달 */}
      {menuActive && (
        <div className="menu-modal">
          <Link to="/flight">항공권</Link>
          <Link to="/photo-search">사진검색</Link>
          <Link to="/community">커뮤니티</Link>
          <Link to="/flight-info">항공정보</Link>
        </div>
      )}
    </div>
  );
};

export default BasicLayout;
