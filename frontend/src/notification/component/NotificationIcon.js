import React from "react";
import { useSelector } from "react-redux";

const NotificationIcon = ({ unreadCount, onClick }) => {
  const recipientNickname = useSelector((state) => state.loginSlice.nickname);

  const handleClick = () => {
    if (!recipientNickname) {
      alert("로그인 상태에서만 이용 가능합니다.");
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
