package com.wanderlust.member.security.filter;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.security.filter
 * FileName       : JWTCheckFilter
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:25  paesir      최초 생성
 */


import com.google.gson.Gson;
import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.member.dto.MemberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Log4j2             // 모든 요청에 대해 체크.
public class JWTCheckFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    log.info("------------------------JWTCheckFilter------------------");

    // 요청 헤더에서 Authorization 추출
    String authHeaderStr = request.getHeader("Authorization");

    if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
      log.warn("Authorization header is missing or does not start with 'Bearer '");

      Gson gson = new Gson();
      String msg = gson.toJson(Map.of("error", "MISSING_AUTHORIZATION_HEADER"));

      response.setContentType("application/json");
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      PrintWriter printWriter = response.getWriter();
      printWriter.println(msg);
      printWriter.close();
      return; // 필터 체인 중단
    }

    // "Bearer " 이후의 토큰만 추출
    String accessToken = authHeaderStr.substring(7);

    try {
      // 토큰 검증
      Map<String, Object> claims = JWTUtil.validateToken(accessToken);
      log.info("JWT claims: " + claims);

      // 클레임에서 사용자 정보 추출
      String email = (String) claims.get("email");
      String pw = (String) claims.get("pw");
      String nickname = (String) claims.get("nickname");
      Boolean social = claims.containsKey("social") ? (Boolean) claims.get("social") : false;
      List<String> roleNames = (List<String>) claims.get("roleNames");

      // MemberDTO 생성 및 인증 컨텍스트 설정
      MemberDTO memberDTO = new MemberDTO(email, pw, nickname, social.booleanValue(), roleNames);
      log.info("-----------------------------------");
      log.info("Authenticated Member: " + memberDTO);

      UsernamePasswordAuthenticationToken authenticationToken =
          new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authenticationToken);

      // 다음 필터로 요청 전달
      filterChain.doFilter(request, response);

    } catch (Exception e) {
      log.error("JWT Check Error:", e);

      Gson gson = new Gson();
      String msg = gson.toJson(Map.of("error", "INVALID_OR_EXPIRED_TOKEN"));

      response.setContentType("application/json");
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      PrintWriter printWriter = response.getWriter();
      printWriter.println(msg);
      printWriter.close();
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
      return true; // Preflight 요청 제외
    }

    String path = request.getRequestURI();
    log.info("Checking URI for filtering: " + path);

    // POST 요청만 필터를 적용
    if (path.equals("/community/posts") && request.getMethod().equalsIgnoreCase("POST")) {
      return false; // 필터 적용
    }

    // 필터를 적용할 경로만 지정
    List<String> protectedPaths = Arrays.asList(
        "/community/posts/{id}",
        "/user/profile",
        "/admin/"
    );

    // 보호된 경로라면 필터 동작
    return protectedPaths.stream().noneMatch(path::startsWith);
  }


}
