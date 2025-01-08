import React, { useState, useEffect } from "react";
import { fetchUnreadNotifications } from "../api/notificationApi";
import { useSelector } from "react-redux";

const NotificationIcon = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const recipientNickname = useSelector((state) => state.loginSlice.nickname);

  useEffect(() => {
    if (!recipientNickname) return;

    const fetchUnreadCount = async () => {
      try {
        const notifications = await fetchUnreadNotifications(recipientNickname);
        setUnreadCount(notifications.length); // 읽지 않은 알림 개수
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadCount();
  }, [recipientNickname]);

  const handleClick = () => {
    if (!recipientNickname) {
      console.warn("로그인 상태에서만 드롭다운을 사용할 수 있습니다.");
      return;
    }
    onClick(); // 로그인 상태일 때만 실행
  };

  return (
    <div
      onClick={handleClick} // 수정된 클릭 이벤트 핸들러
      style={{
        position: "relative",
        cursor: recipientNickname ? "pointer" : "not-allowed", // 비로그인 시 클릭 불가 스타일
        display: "inline-block",
      }}
    >
      {/* 항상 표시되는 알림 아이콘 */}
      <img
        src="/icons/notification.svg"
        alt="notification"
        style={{ width: "60px", height: "60px", marginTop: "20px" }}
      />
      {/* 읽지 않은 알림 개수 표시 (unreadCount > 0일 때만) */}
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            lineHeight: "10px",
            top: 0,
            right: 0,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "0.3em",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
