package com.wanderlust.notification.repository;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.repository
 * FileName       : NotificationRepository
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 4:05  paesir      최초 생성
 */


import com.wanderlust.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // 특정 사용자의 알림 조회
    List<Notification> findByRecipientNicknameOrderByCreatedAtDesc(String recipientNickname);

    // 읽지 않은 알림 조회
    List<Notification> findByRecipientNicknameAndIsReadFalseOrderByCreatedAtDesc(String recipientNickname);

    // 알림 삭제
    void deleteByRecipientNickname(String recipientNickname);

    // 알림 읽음 상태 업데이트
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId")
    void markAsRead(@Param("notificationId") Long notificationId);
}
