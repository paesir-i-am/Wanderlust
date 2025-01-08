import React, { useState, useEffect } from "react";
import {
  fetchAllNotifications,
  deleteNotification,
} from "../api/notificationApi";

const NotificationListPage = () => {
  const [notifications, setNotifications] = useState([]);
  const recipientNickname = useState((state) => state.loginSlice.nickname);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetchAllNotifications(recipientNickname);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id)); // 삭제된 알림 제거
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div>
      <h1>전체 알림</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            style={{ padding: "10px", borderBottom: "1px solid #eee" }}
          >
            <p>{notification.data}</p>
            <button
              style={{
                marginTop: "5px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
              }}
              onClick={() => handleDelete(notification.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationListPage;
