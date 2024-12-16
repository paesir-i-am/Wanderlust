package com.wanderlust.common.security.handler;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.security.handler
 * FileName       : CustomAccessDeniedHandler
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 5:42  paesir      최초 생성
 */


import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response,
                     AccessDeniedException accessDeniedException) throws IOException, ServletException {

    Gson gson = new Gson();

    String jsonStr = gson.toJson(Map.of("error", "ERROR_ACCESSDENIED"));

    response.setContentType("application/json");
    response.setStatus(HttpStatus.FORBIDDEN.value());
    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.close();

  }

}
