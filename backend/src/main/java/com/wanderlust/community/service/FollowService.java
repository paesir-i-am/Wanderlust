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


import java.util.List;

public interface FollowService {
  void follow(String followerNickname, String followingNickname);
  void unfollow(String followerNickname, String followingNickname);

  List<String> getFollowers(String nickname);
  List<String> getFollowings(String nickname);
}
