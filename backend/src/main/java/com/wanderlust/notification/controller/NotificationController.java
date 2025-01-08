package com.wanderlust.notification.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.controller
 * FileName       : NotificationController
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 4:21  paesir      최초 생성
 */

import com.wanderlust.notification.entity.Notification;
import com.wanderlust.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {
  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping("/{recipientNickname}")
  public ResponseEntity<List<Notification>> getNotifications(@PathVariable String recipientNickname) {
    List<Notification> notifications = notificationService.getNotificationsByRecipient(recipientNickname);
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/{recipientNickname}/unread")
  public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String recipientNickname) {
    List<Notification> unreadNotifications = notificationService.getUnreadNotifications(recipientNickname);
    return ResponseEntity.ok(unreadNotifications);
  }

  @PostMapping("/{notificationId}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
    notificationService.markNotificationAsRead(notificationId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{recipientNickname}")
  public ResponseEntity<Void> deleteNotifications(@PathVariable String recipientNickname) {
    notificationService.deleteNotificationsByRecipient(recipientNickname);
    return ResponseEntity.noContent().build();
  }
}
