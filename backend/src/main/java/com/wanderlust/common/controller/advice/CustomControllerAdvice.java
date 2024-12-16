package com.wanderlust.common.controller.advice;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.controller.advice
 * FileName       : CustomControllerAdvice
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 5:31  paesir      최초 생성
 */


import com.wanderlust.common.util.CustomJWTException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class CustomControllerAdvice {


  @ExceptionHandler(NoSuchElementException.class)
  protected ResponseEntity<?> notExist(NoSuchElementException e) {

    String msg = e.getMessage();

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", msg));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {

    String msg = e.getMessage();

    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("msg", msg));
  }

  @ExceptionHandler(CustomJWTException.class)
  protected ResponseEntity<?> handleJWTException(CustomJWTException e) {

    String msg = e.getMessage();

    return ResponseEntity.ok().body(Map.of("error", msg));
  }

}
