package com.wanderlust.community.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.controller
 * FileName       : FollowController
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오후 5:07  paesir      최초 생성
 */

import com.wanderlust.community.service.FollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.wanderlust.common.util.JWTUtil;

import java.util.Map;

@RestController
@RequestMapping("/community/follow")
public class FollowController {

  private final FollowService followService;

  public FollowController(FollowService followService) {
    this.followService = followService;
  }

  // 팔로우 하기
  @PostMapping("/{followingNickname}")
  public ResponseEntity<String> follow(
      @PathVariable String followingNickname,
      @RequestHeader("Authorization") String authorization) {
    // 토큰에서 닉네임 추출
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String followerNickname = (String) claims.get("nickname");

    // 팔로우 처리
    followService.follow(followerNickname, followingNickname);
    return ResponseEntity.ok("Followed successfully");
  }

  // 언팔로우 하기
  @DeleteMapping("/{followingNickname}")
  public ResponseEntity<String> unfollow(
      @PathVariable String followingNickname,
      @RequestHeader("Authorization") String authorization) {
    // 토큰에서 닉네임 추출
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String followerNickname = (String) claims.get("nickname");

    // 언팔로우 처리
    followService.unfollow(followerNickname, followingNickname);
    return ResponseEntity.ok("Unfollowed successfully");
  }

  // 팔로잉 목록 조회
  @GetMapping("/followings")
  public ResponseEntity<?> getFollowings(
      @RequestHeader("Authorization") String authorization) {
    // 토큰에서 닉네임 추출
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String nickname = (String) claims.get("nickname");

    // 팔로잉 목록 조회
    return ResponseEntity.ok(followService.getFollowings(nickname));
  }

  // 팔로워 목록 조회
  @GetMapping("/followers")
  public ResponseEntity<?> getFollowers(
      @RequestHeader("Authorization") String authorization) {
    // 토큰에서 닉네임 추출
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String nickname = (String) claims.get("nickname");

    // 팔로워 목록 조회
    return ResponseEntity.ok(followService.getFollowers(nickname));
  }
}