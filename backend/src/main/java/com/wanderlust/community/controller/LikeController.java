package com.wanderlust.community.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.controller
 * FileName       : LikeController
 * Author         : paesir
 * Date           : 24. 12. 27.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 27.오후 12:58  paesir      최초 생성
 */

import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.community.service.LikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/community/posts")
public class LikeController {

  private final LikeService likeService;

  public LikeController(LikeService likeService) {
    this.likeService = likeService;
  }

  //좋아요 기능
  @PostMapping("/{id}/like")
  public ResponseEntity<Void> toggleLike(
      @PathVariable Long id,
      @RequestHeader("Authorization") String authorization) {

    // 토큰 검증 및 이메일 추출
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String email = (String) claims.get("email");

    // 좋아요 처리
    likeService.toggleLike(id, email);
    return ResponseEntity.ok().build();
  }

  //좋아요 카운트 확인
  @GetMapping("/{id}/likes")
  public ResponseEntity<Integer> getLikes(@PathVariable Long id) {
    int likesCount = likeService.getLikesCount(id);
    return ResponseEntity.ok(likesCount);
  }

  // 사용자의 좋아요 상태 확인 (비로그인 대처 기능 추가)
  @GetMapping("/{id}/isLiked")
  public ResponseEntity<Boolean> isPostLiked(
      @PathVariable Long id,
      @RequestHeader(value = "Authorization", required = false) String authorization) {

    if(authorization == null || !authorization.startsWith("Bearer ")) {
      return ResponseEntity.ok(false);
    }

    System.out.println(id);

    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String email = (String) claims.get("email");

    boolean isLiked = likeService.isLiked(id, email);
    return ResponseEntity.ok(isLiked);
  }
}