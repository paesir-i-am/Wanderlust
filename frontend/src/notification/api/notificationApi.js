import axiosInstance from "../../common/api/mainApi";

// 읽지 않은 알림 가져오기
export const fetchUnreadNotifications = async (recipientNickname, token) => {
  const response = await axiosInstance.get(
    `/notification/${recipientNickname}/unread`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// 모든 알림 가져오기
export const fetchAllNotifications = async (recipientNickname, token) => {
  const response = await axiosInstance.get(
    `/notification/${recipientNickname}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// 알림 읽음 처리
export const markAsRead = async (notificationId, token) => {
  await axiosInstance.post(`/notification/${notificationId}/read`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 알림 삭제
export const deleteNotification = async (recipientNickname, token) => {
  await axiosInstance.delete(`/notification/${recipientNickname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
