package com.wanderlust.member.entity;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.entity
 * FileName       : Member
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:22  paesir      최초 생성
 */


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "RoleList")
public class Member {

  @Id
  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String pw;

  @Column(unique = true, nullable = false)
  private String nickname;

  @Column(nullable = false)
  private boolean social;

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private List<MemberRole> RoleList = new ArrayList<>();

  public void addRole(MemberRole memberRole){

    RoleList.add(memberRole);
  }

  public void clearRole(){
    RoleList.clear();
  }

  public void changeNickname(String nickname) {
    this.nickname = nickname;
  }

  public void changePw(String pw){
    this.pw = pw;
  }

  public void changeSocial(boolean social) {
    this.social = social;
  }

}
