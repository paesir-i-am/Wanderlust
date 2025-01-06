package com.wanderlust.member.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.controller
 * FileName       : SocialController
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:19  paesir      최초 생성
 */


import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.service.MemberService;
import com.wanderlust.member.service.SocialMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

  private final MemberService memberService;
  private final SocialMemberService socialMemberService;

  @GetMapping("/member/kakao")
  public Map<String,Object> getMemberFromKakao(String accessToken) {

    log.info("access Token ");
    log.info(accessToken);

    MemberDTO memberDTO = socialMemberService.getKakaoMember(accessToken);

    Map<String, Object> claims = memberDTO.getClaims();

    String jwtAccessToken = JWTUtil.generateToken(claims, 60*24);
    String jwtRefreshToken = JWTUtil.generateToken(claims,60*24*30);

    claims.put("accessToken", jwtAccessToken);
    claims.put("refreshToken", jwtRefreshToken);

    return claims;
  }


}
