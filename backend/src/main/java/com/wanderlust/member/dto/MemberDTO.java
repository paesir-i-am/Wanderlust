package com.wanderlust.member.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.dto
 * FileName       : MemberDTO
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 3:16  paesir      최초 생성
 * 24. 12. 14.오후 3:21   이정현       DTO 및 엔터티 구조 변경 및 획일화 User 상속은 Service 에서 구현하도록 수정
 */


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
public class MemberDTO {
  private Long id;
  private String email;
  private String name;
  private boolean isSocial;
  private String provider; // 소셜 로그인 제공자
  private String providerUserId; // 소셜 로그인 제공자의 사용자 ID
  private List<String> roles;

  // 생성자
  public MemberDTO(Long id, String name, String email, boolean isSocial, String provider, String providerUserId, List<String> roles) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isSocial = isSocial;
    this.provider = provider;
    this.providerUserId = providerUserId;
    this.roles = roles;
  }

  // 클레임 맵 생성 (JWT 등에 사용)
  public Map<String, Object> getClaims() {
    Map<String, Object> dataMap = new HashMap<>();
    dataMap.put("id", id);
    dataMap.put("name", name);
    dataMap.put("email", email);
    dataMap.put("isSocial", isSocial);
    dataMap.put("provider", provider);
    dataMap.put("providerUserId", providerUserId);
    dataMap.put("roles", roles);
    return dataMap;
  }
}

