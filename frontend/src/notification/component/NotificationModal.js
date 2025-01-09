import React, { useEffect, useState } from "react";
import {
  fetchAllNotifications,
  markAsRead,
  deleteNotification,
} from "../api/notificationApi";
import useCustomLogin from "../../member/hook/useCustomLogin";
import { useSelector } from "react-redux";
import "./notificationModal.css";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLogin } = useCustomLogin();
  const recipientNickname = useSelector((state) => state.loginSlice.nickname);

  useEffect(() => {
    if (!isLogin) return;

    const fetchNotifications = async () => {
      try {
        const allNotifications = await fetchAllNotifications(recipientNickname);

        const mappedNotifications = allNotifications.map((notification) => ({
          ...notification,
          isRead: notification.read,
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("Failed to fetch all notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isLogin, recipientNickname]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(recipientNickname);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="notification-modal">
        <div className="notification-modal__overlay" onClick={onClose}></div>
        <div className="notification-modal__content">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-modal">
      <div className="notification-modal__overlay" onClick={onClose}></div>
      <div className="notification-modal__content">
        <h2>전체 알림</h2>
        <button className="notification-modal__close" onClick={onClose}>
          X
        </button>
        <ul>
          {notifications.length === 0 ? (
            <li>알림이 없습니다.</li>
          ) : (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${
                  notification.isRead ? "read" : "unread"
                }`}
              >
                <p>{notification.data}</p>
                <div className="notification-item__actions">
                  {!notification.isRead && (
                    <button
                      className="mark-as-read-button"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      읽음
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationModal;
