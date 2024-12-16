package com.wanderlust.member.domain;

/*
 * Description    : 소셜로그인 엔터티
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.domain
 * FileName       : MemberSocial
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 2:41  paesir      최초 생성
 */

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "member_social")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberSocial {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @Column(nullable = false)
  private String provider;

  @Column(nullable = false)
  private String providerUserId;

  private String accessToken;
  private String refreshToken;
}
