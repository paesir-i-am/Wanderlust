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

import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.community.dto.ProfileResponseDTO;
import com.wanderlust.community.service.FollowService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

  // 팔로우 상태 조회
  @GetMapping("/status/{nickname}")
  public ResponseEntity<Boolean> checkFollowStatus(
      @PathVariable String nickname,
      @RequestHeader("Authorization") String authorization) {
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String currentUserNickname = (String) claims.get("nickname");

    // 서비스에서 팔로우 상태 확인
    boolean isFollowing = followService.isFollowing(currentUserNickname, nickname);
    return ResponseEntity.ok(isFollowing);
  }

  // 팔로워 목록 조회
  @GetMapping("/followers/{nickname}")
  public ResponseEntity<Page<ProfileResponseDTO>> getFollowers(
      @PathVariable String nickname,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ProfileResponseDTO> followers = followService.getFollowers(nickname, pageable);
    return ResponseEntity.ok(followers);
  }

  // 팔로잉 목록 조회
  @GetMapping("/following/{nickname}")
  public ResponseEntity<Page<ProfileResponseDTO>> getFollowing(
      @PathVariable String nickname,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ProfileResponseDTO> following = followService.getFollowing(nickname, pageable);
    return ResponseEntity.ok(following);
  }

  //팔로우 카운트 조회
  @GetMapping("/{nickname}/count")
  public ResponseEntity<Map<String, Long>> getFollowCounts(@PathVariable String nickname) {
    long followers = followService.getFollowersCount(nickname);
    long following = followService.getFollowingCount(nickname);
    return ResponseEntity.ok(Map.of(
        "followers", followers,
        "following", following
    ));
  }

  //랜덤 팔로우 목록 생성
}