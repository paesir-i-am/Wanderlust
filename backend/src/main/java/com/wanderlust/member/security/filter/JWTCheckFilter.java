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
import java.util.List;
import java.util.Map;

@Log4j2             // 모든 요청에 대해 체크.
public class JWTCheckFilter extends OncePerRequestFilter {

  @Override   // 필터로 체크하지 않을 경로나 메서드(get/post)등을 지정하기 위해사용.
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    // Preflight요청은 체크하지 않음
    if (request.getMethod().equals("OPTIONS")) {
      return true;
    }
    String path = request.getRequestURI();

    log.info("check uri......................." + path);
    //api/member/ 경로의 호출은 체크하지 않음
    if (path.startsWith("/member/")) {
      return true;
    }
    return false;
  }

  @Override// validateToken()를 활용해서 예외의 발생여부를 확인.
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    log.info("------------------------JWTCheckFilter------------------");

    String authHeaderStr = request.getHeader("Authorization");

    try {
      //Bearer accestoken...
      String accessToken = authHeaderStr.substring(7);
      Map<String, Object> claims = JWTUtil.validateToken(accessToken);

      log.info("JWT claims: " + claims);

      String email = (String) claims.get("email");
      String pw = (String) claims.get("pw");
      String nickname = (String) claims.get("nickname");
      Boolean social = (Boolean) claims.get("social");
      List<String> roleNames = (List<String>) claims.get("roleNames");

      MemberDTO memberDTO = new MemberDTO(email, pw, nickname, social.booleanValue(), roleNames);

      log.info("-----------------------------------");
      log.info(memberDTO);
      log.info(memberDTO.getAuthorities());

      UsernamePasswordAuthenticationToken authenticationToken
          = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authenticationToken);

      filterChain.doFilter(request, response);

    }catch(Exception e){

      log.error("JWT Check Error..............");
      log.error(e.getMessage());

      Gson gson = new Gson();
      String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

      response.setContentType("application/json");
      PrintWriter printWriter = response.getWriter();
      printWriter.println(msg);
      printWriter.close();

    }
  }
}
