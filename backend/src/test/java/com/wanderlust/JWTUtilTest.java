package com.wanderlust;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust
 * FileName       : JWTUtilTest
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오후 12:55  paesir      최초 생성
 */


import com.wanderlust.common.util.CustomJWTException;
import com.wanderlust.common.util.JWTUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class JWTUtilTest {

  @Autowired
  private JWTUtil jwtUtil;

  private Map<String, Object> claims;

  @BeforeEach
  void setUp() {
    claims = Map.of(
        "username", "testUser",
        "role", "ROLE_USER"
    );
  }

  @Test
  void testGenerateToken() {
    // When
    String token = jwtUtil.generateToken(claims, 10);

    // Then
    assertNotNull(token);
    System.out.println("Generated Token: " + token);
  }

  @Test
  void testValidateToken() {
    // Given
    String token = jwtUtil.generateToken(claims, 10);

    // When
    Map<String, Object> validatedClaims = jwtUtil.validateToken(token);

    // Then
    assertEquals("testUser", validatedClaims.get("username"));
    assertEquals("ROLE_USER", validatedClaims.get("role"));
  }

  @Test
  void testExpiredToken() {
    // Given
    String token = jwtUtil.generateToken(claims, -1); // 만료된 토큰 생성

    // When & Then
    Exception exception = assertThrows(CustomJWTException.class, () -> {
      jwtUtil.validateToken(token);
    });

    assertEquals("Token expired", exception.getMessage());
  }

  @Test
  void testInvalidToken() {
    // Given
    String invalidToken = "invalid.token.value";

    // When & Then
    Exception exception = assertThrows(CustomJWTException.class, () -> {
      jwtUtil.validateToken(invalidToken);
    });

    assertEquals("Malformed token", exception.getMessage());
  }
}
