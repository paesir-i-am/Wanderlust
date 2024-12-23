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
import com.wanderlust.member.dto.MemberModifyDTO;
import com.wanderlust.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

  @GetMapping("/member/kakao")
  public Map<String, Object> handleKakaoLogin(@AuthenticationPrincipal MemberDTO memberDTO) {
    log.info("Handle kakao login for : {}",memberDTO);

    //JWT 토큰 생성
    Map<String , Object> claims = memberDTO.getClaims();
    String jwtAccessToken = JWTUtil.generateToken(claims, 60);
    String jwtRefreshToken = JWTUtil.generateToken(claims, 60*24);

    //토큰 응답
    return Map.of("accessToken", jwtAccessToken, "refreshToken", jwtRefreshToken);
  }
}
