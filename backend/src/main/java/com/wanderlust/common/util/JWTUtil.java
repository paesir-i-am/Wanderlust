package com.wanderlust.common.util;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.util
 * FileName       : JWTUtil
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:31  paesir      최초 생성
 */


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
@Component
public class JWTUtil {
    // 30자 이상
    private static String key = "wanderlustjwtutilkey974991200101743090dksltlqkfdhodkseho";

    // jwt 토큰을 생성하기 위한 메서드.
    public static String generateToken(Map<String, Object> valueMap, int min){

        SecretKey key = null;

        try{
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

        }catch(Exception e){
            throw new RuntimeException(e.getMessage());
        }

        String jwtStr = Jwts.builder()
            .setHeader(Map.of("typ","JWT"))
            .setClaims(valueMap)
            .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
            .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
            .signWith(key)
            .compact();

        return jwtStr;
    }
    // 검증을 위한 메서드
    public static Map<String, Object> validateToken(String token) {

        Map<String, Object> claim = null;

        try{

            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

            claim = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token) // 파싱 및 검증, 실패 시 에러
                .getBody();

        }catch(MalformedJwtException malformedJwtException){
            throw new CustomJWTException("MalFormed", malformedJwtException);
        }catch(ExpiredJwtException expiredJwtException){
            throw new CustomJWTException("Expired", expiredJwtException);
        }catch(InvalidClaimException invalidClaimException){
            throw new CustomJWTException("Invalid", invalidClaimException);
        }catch(JwtException jwtException){
            throw new CustomJWTException("JWTError", jwtException);
        }catch(Exception e){
            throw new CustomJWTException("Error", e);
        }
        return claim;
    }

}
