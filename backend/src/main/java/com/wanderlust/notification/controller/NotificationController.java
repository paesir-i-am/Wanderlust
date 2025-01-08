package com.wanderlust.notification.controller;

import com.wanderlust.common.util.JWTUtil;
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
  public ResponseEntity<List<Notification>> getNotifications(
      @PathVariable String recipientNickname,
      @RequestHeader("Authorization") String authorization) {
    JWTUtil.validateToken(authorization.substring(7));
    List<Notification> notifications = notificationService.getNotificationsByRecipient(recipientNickname);
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/{recipientNickname}/unread")
  public ResponseEntity<List<Notification>> getUnreadNotifications(
      @PathVariable String recipientNickname,
      @RequestHeader("Authorization") String authorization) {
    JWTUtil.validateToken(authorization.substring(7));
    List<Notification> unreadNotifications = notificationService.getUnreadNotifications(recipientNickname);
    return ResponseEntity.ok(unreadNotifications);
  }

  @PostMapping("/{notificationId}/read")
  public ResponseEntity<Void> markAsRead(
      @PathVariable Long notificationId,
      @RequestHeader("Authorization") String authorization) {
    JWTUtil.validateToken(authorization.substring(7));
    notificationService.markNotificationAsRead(notificationId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{recipientNickname}")
  public ResponseEntity<Void> deleteNotifications(
      @PathVariable String recipientNickname,
      @RequestHeader("Authorization") String authorization) {
    JWTUtil.validateToken(authorization.substring(7));
    notificationService.deleteNotificationsByRecipient(recipientNickname);
    return ResponseEntity.noContent().build();
  }
}