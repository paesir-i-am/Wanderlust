package com.wanderlust.notification.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.dto
 * FileName       : NotificationResponseDTO
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 4:03  paesir      최초 생성
 */

import com.wanderlust.notification.entity.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
    private Long id;                  // 알림 ID
    private NotificationType type;    // 알림 유형
    private String recipientNickname; // 알림을 받을 사용자
    private Long referencedId;        // 관련된 엔티티 ID
    private String data;              // 추가 데이터 (JSON 형식)
    private boolean isRead;           // 읽음 여부
    private LocalDateTime createdAt;  // 생성 시간
}
