import React, { useState, useEffect } from "react";
import { fetchUnreadNotifications, markAsRead } from "../api/notificationApi";
import { useSelector } from "react-redux";
import "./NotificationDropdown.scss";

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const recipientNickname = useSelector((state) => state.loginSlice.nickname);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetchUnreadNotifications(recipientNickname);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [recipientNickname]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id)); // 읽은 알림 제거
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="notification-dropdown">
      <ul className="notification-list">
        {notifications.length === 0 ? (
          <li className="notification-empty">읽지 않은 알림이 없습니다.</li>
        ) : (
          notifications.map((notification) => (
            <li key={notification.id} className="notification-item">
              <p className="notification-text">{notification.data}</p>
              <button
                className="notification-read-button"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                읽음
              </button>
            </li>
          ))
        )}
        <li className="notification-footer">
          <button className="notification-view-all" onClick={onClose}>
            모든 알림 보기
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NotificationDropdown;
