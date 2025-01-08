package com.wanderlust.notification.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.service
 * FileName       : NotificationServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 4:20  paesir      최초 생성
 */


import com.wanderlust.notification.entity.Notification;
import com.wanderlust.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
  private final NotificationRepository notificationRepository;

  public NotificationServiceImpl(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  @Override
  public List<Notification> getNotificationsByRecipient(String recipientNickname) {
    return notificationRepository.findByRecipientNicknameOrderByCreatedAtDesc(recipientNickname);
  }

  @Override
  public List<Notification> getUnreadNotifications(String recipientNickname) {
    return notificationRepository.findByRecipientNicknameAndIsReadFalseOrderByCreatedAtDesc(recipientNickname);
  }

  @Override
  public void deleteNotificationsByRecipient(String recipientNickname) {
    notificationRepository.deleteByRecipientNickname(recipientNickname);
  }

  @Override
  public void markNotificationAsRead(Long notificationId) {
    notificationRepository.markAsRead(notificationId);
  }
}
