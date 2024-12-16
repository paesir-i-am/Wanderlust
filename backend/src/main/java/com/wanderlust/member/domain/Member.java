package com.wanderlust.member.domain;

/*
 * Description    : 회원 엔터티
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.domain
 * FileName       : Member
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 2:32  paesir      최초 생성
 */

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// @EntityListeners는 엔터티의 생명주기 이벤트를 처리하기 위한 리스너 클래스를 지정하는 데 사용됩니다.
// 여기서는 AuditingEntityListener를 통해 생성/수정 시간 필드(regDate, modDate)가 자동으로 관리됩니다.
@EntityListeners(value = {AuditingEntityListener.class})
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "member")
@ToString(exclude = {"memberRoleList", "socialAccounts"})
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name; // nickname -> name으로 통일

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password; // pw -> password로 변경

  @Column(nullable = false)
  private boolean isSocial; // social -> isSocial로 변경

  @CreatedDate
  @Column(updatable = false)
  private LocalDateTime createdDate;

  @LastModifiedDate
  private LocalDateTime modifiedDate;

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private List<MemberRole> memberRoleList = new ArrayList<>();

  public void addRole(MemberRole memberRole) {
    memberRoleList.add(memberRole);
  }

  public void clearRole() {
    memberRoleList.clear();
  }

  public void changeName(String name) { // changeNickname -> changeName으로 수정
    this.name = name;
  }

  public void changePassword(String password) { // changePw -> changePassword로 수정
    this.password = password;
  }

  public void changeSocialStatus(boolean isSocial) { // changeSocial -> changeSocialStatus로 명확히
    this.isSocial = isSocial;
  }

  @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<MemberSocial> socialAccounts = new ArrayList<>();

  public void addSocialAccount(MemberSocial memberSocial) {
    this.socialAccounts.add(memberSocial);
    memberSocial.setMember(this); // 양방향 관계 설정
  }
}

