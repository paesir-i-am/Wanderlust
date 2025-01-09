package com.wanderlust.notification.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.dto
 * FileName       : NotificationRequestDTO
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 4:02  paesir      최초 생성
 */

import com.wanderlust.notification.entity.NotificationType;
import lombok.Data;

@Data
public class NotificationRequestDTO {
  private String recipientNickname;
  private NotificationType type;
  private Long referencedId;
  private String data;
}
