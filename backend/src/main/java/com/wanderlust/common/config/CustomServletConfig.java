package com.wanderlust.common.config;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.config
 * FileName       : CustomServletConfig
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 5:26  paesir      최초 생성
 */


import com.wanderlust.common.controller.formatter.LocalDateFormatter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CustomServletConfig implements WebMvcConfigurer {

  @Override
  public void addFormatters(FormatterRegistry registry) {

    registry.addFormatter(new LocalDateFormatter());
  }
}
