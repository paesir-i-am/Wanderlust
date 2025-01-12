package com.wanderlust.common.config;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.config
 * FileName       : CustomServletConfig
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:16  paesir      최초 생성
 */


import com.wanderlust.common.controller.formatter.LocalDateFormatter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CustomServletConfig implements WebMvcConfigurer {

  @Override
  public void addFormatters(FormatterRegistry registry) {

    registry.addFormatter(new LocalDateFormatter());
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/backend/uploads/**")
        .addResourceLocations("file:" + System.getProperty("user.dir") + "/backend/uploads/");
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/payments/**") // 결제 관련 API에 대해 CORS 허용
            .allowedOrigins("http://localhost:3000") // React 개발 서버 주소
            .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드
            .allowedHeaders("*")
            .allowCredentials(true); // 인증 정보 허용
  }

}
