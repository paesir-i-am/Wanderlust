package com.wanderlust.community.entity;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.entity
 * FileName       : Profile
 * Author         : paesir
 * Date           : 25. 1. 1.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 1.오후 11:58  paesir      최초 생성
 */

import com.wanderlust.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {
  @Id
  private String email;

  @OneToOne(cascade = CascadeType.ALL)
  @MapsId
  @JoinColumn(name = "member_email", referencedColumnName = "email")
  private Member member;

  private String nickname;

  @Column(length = 1000) // 글자수 제한
  private String bio; // 자기소개
  private String profileImage; // 프로필 이미지

  @Column(nullable = false)
  @Builder.Default
  private int followerCount = 0;

  @Column(nullable = false)
  @Builder.Default
  private int followingCount = 0;

  public void increaseFollowers() {
    this.followerCount++;
  }
  public void increaseFollowings() {
    this.followingCount++;
  }
  public void decreaseFollowers() {
    this.followerCount--;
  }
  public void decreaseFollowings() {
    this.followingCount--;
  }

}
