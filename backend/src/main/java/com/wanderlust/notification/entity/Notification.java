package com.wanderlust.notification.entity;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.notification.entity
 * FileName       : Notification
 * Author         : paesir
 * Date           : 25. 1. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 7.오후 3:43  paesir      최초 생성
 */


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Notification")
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private NotificationType type;

  @Column(nullable = false)
  private String recipientNickname;

  @Column(nullable = false)
  private Long referencedId;

  @Lob
  private String data; // JSON 형식 데이터

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(nullable = false)
  private boolean isRead = false;

}
