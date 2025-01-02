package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : FollowService
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오후 5:04  paesir      최초 생성
 */


import com.wanderlust.community.dto.ProfileResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {
  void follow(String followerNickname, String followingNickname);
  void unfollow(String followerNickname, String followingNickname);
  boolean isFollowing(String followerNickname, String followingNickname);

  Page<ProfileResponseDTO> getFollowers(String nickname, Pageable pageable);
  Page<ProfileResponseDTO> getFollowing(String nickname, Pageable pageable);

  long getFollowersCount(String nickname);
  long getFollowingCount(String nickname);
}
