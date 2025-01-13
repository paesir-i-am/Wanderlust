import React, { useState } from "react";
import "./notificationDropdown.css";
import NotificationModal from "./NotificationModal";

const NotificationDropdown = ({ notifications = [], onMarkAsRead }) => {
  // 상태로 알림 관리
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleMarkAsRead = (id) => {
    // 읽음 처리 콜백 실행
    onMarkAsRead(id);

    // 로컬 상태에서 알림 제거
    setLocalNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div className="notification-dropdown">
      <ul className="notification-list">
        {localNotifications.length === 0 ? (
          <li className="notification-empty">읽지 않은 알림이 없습니다.</li>
        ) : (
          localNotifications.map((notification) => (
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
          <button className="notification-view-all" onClick={handleOpenModal}>
            모든 알림 보기
          </button>
        </li>
      </ul>
      {showModal && <NotificationModal onClose={handleCloseModal} />}
    </div>
  );
};

export default NotificationDropdown;
