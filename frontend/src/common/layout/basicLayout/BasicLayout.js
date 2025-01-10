import React, { useEffect, useState } from "react";
import { useCustomLogin } from "../../../member/hook/useCustomLogin";
import { Link } from "react-router-dom";
import "./basicLayout.css";
import FlightSearch from "../../../flight/components/FlightSearch";
import ImageSearchButton from "../../../image/ImageSearchButton";
import CitySearchBar from "../../component/CitySearchBar";
import NotificationIcon from "../../../notification/component/NotificationIcon";
import NotificationDropdown from "../../../notification/component/NotificationDropdown";
import {
  fetchUnreadNotifications,
  markAsRead,
} from "../../../notification/api/notificationApi";
import { useSelector } from "react-redux";


const BasicLayout = ({ children }) => {
  const [activeOption, setActiveOption] = useState("왕복");
  const [menuActive, setMenuActive] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFlightSearch, setShowFlightSearch] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const { isLogin, moveToLogin, doLogout, moveToPath, doLoginPopup } =
    useCustomLogin();
  const recipientNickname = useSelector((state) => state.loginSlice.nickname);

  const toggleFlightSearch = () => {
    setShowFlightSearch((prev) => !prev);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  useEffect(() => {
    if (!isLogin) return;

    const fetchNotifications = async () => {
      try {
        const unread = await fetchUnreadNotifications(recipientNickname);
        setUnreadCount(unread.length);
        setNotifications(unread);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [recipientNickname]);

  const handleShowDropdown = async () => {
    try {
      const unread = await fetchUnreadNotifications(recipientNickname);
      setNotifications(unread);
      setUnreadCount(unread.length);
      setShowDropdown((prev) => !prev);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  return (
    <div className="basic-layout">
      {/*상단 헤더*/}
      <header className="basic-layout__header header-fixed">
        <div className="basic-layout__header-overlay header-overlay">
          <div className="basic-layout__header-top header-top">
            <div className="basic-layout__logo logo">
              <Link to="/">
                <img
                  src="/wanderlustHeadLogo.svg"
                  alt="Wanderlust Logo"
                  className="basic-layout__logo-img"
                />
              </Link>
            </div>


            {/* 데스크탑 검색창 */}
            <div className="basic-layout__searchbar searchbar desktop-only">
              <CitySearchBar />
              <div className="basic-layout__search-button">
                <ImageSearchButton />
                <button>
                  <img src="/icons/searchIcon.svg" alt="Search" />
            {/*데스크탑 검색창*/}
            <div className="basic-layout__searchbar searchbar desktop-only">
              <input
                type="text"
                placeholder="Search your Memory, will craft moments of now Ones.."
                className="basic-layout__search-input search-input"
              />
              <div className="basic-layout__search-buttons search-buttons">
                <button className="basic-layout__search-button">
                  <img
                    src="/icons/picturSearchIcon.svg"
                    alt="PictureSearch"
                    className="basic-layout__search-icon"
                  />
                </button>
                <button className="basic-layout__search-button">
                  <img
                    src="/icons/searchIcon.svg"
                    alt="Search"
                    className="basic-layout__search-icon"
                  />
                </button>
              </div>
            </div>

            {/*모바일 검색창*/}
            {showSearch && (
              <div className="basic-layout__searchbar-mobile searchbar mobile-only">
                <input
                  type="text"
                  className="basic-layout__search-input-mobile search-input"
                  placeholder="Search your Memory, will craft moments of now Ones.."
                />
                <div className="basic-layout__search-buttons-mobile search-buttons mobile-only">
                  <button className="basic-layout__search-button">
                    <img
                      src="/icons/searchIcon.svg"
                      alt="검색"
                      className="basic-layout__search-icon"
                    />
                  </button>
                </div>
              </div>
            )}

            {/*아이콘*/}
            <div className="basic-layout__icons icons desktop-only">
              <div
                className="basic-layout__notification-wrapper"
                style={{ position: "relative" }}
              >
                <NotificationIcon
                  unreadCount={unreadCount}
                  onClick={handleShowDropdown}
                />
                {showDropdown && (
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                  />
                )}
              </div>
              <button className="basic-layout__icon-button">
                <img
                  src="/icons/reservation.svg"
                  alt="Reservations"
                  className="basic-layout__icon-img"
                />
              </button>
              {isLogin ? (
                <button
                  className="basic-layout__icon-button"
                  onClick={doLogout}
                >
                  <img
                    src="/icons/logout.svg"
                    alt="Logout"
                    className="basic-layout__icon-img"
                  />
                </button>
              ) : (
                <button
                  className="basic-layout__icon-button"
                  onClick={doLoginPopup}
                >
                  <img
                    src="/icons/login.svg"
                    alt="Login"
                    className="basic-layout__icon-img"
                  />
                </button>
              )}
            </div>
          </div>

          {/*데스크탑 메뉴*/}
          <nav className="basic-layout__nav nav desktop-only">
            <Link to="/" className="basic-layout__nav-link">
              전체메뉴
            </Link>
            <Link
              to="#"
              onClick={toggleFlightSearch}
              className="basic-layout__nav-link"
            >
              항공권
            </Link>
            <Link to="/photo-search" className="basic-layout__nav-link">
              사진검색
            </Link>
            <Link to="/community" className="basic-layout__nav-link">
              커뮤니티
            </Link>
            <Link to="/flight-info" className="basic-layout__nav-link">
              항공정보
            </Link>
          </nav>
        </div>
        {showFlightSearch && (
          <div className="basic-layout__search-section search mobile-only">
            <FlightSearch
              activeOption={activeOption}
              setActiveOption={setActiveOption}
            />
          </div>
        )}
      </header>

      {/*본문 컨텐츠*/}
      <main className="basic-layout__content content">{children}</main>

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
