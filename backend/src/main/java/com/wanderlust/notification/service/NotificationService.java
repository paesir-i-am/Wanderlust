package com.wanderlust.notification.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.service
 * FileName       : NotificationService
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 4:19  paesir      최초 생성
 */


import com.wanderlust.notification.entity.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsByRecipient(String recipientNickname);
    List<Notification> getUnreadNotifications(String recipientNickname);
    void deleteNotificationsByRecipient(String recipientNickname);
    void markNotificationAsRead(Long notificationId);
}
