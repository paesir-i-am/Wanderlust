import React, { useState } from "react";
import "./notificationDropdown.css";
import NotificationModal from "./NotificationModal";

const NotificationDropdown = ({ notifications = [], onMarkAsRead }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
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
                onClick={() => onMarkAsRead(notification.id)}
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
