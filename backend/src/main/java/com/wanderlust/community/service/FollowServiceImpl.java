package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : FollowServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오후 5:05  paesir      최초 생성
 */

import com.wanderlust.community.entity.Follow;
import com.wanderlust.community.repository.FollowRepository;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
  private final FollowRepository followRepository;
  private final MemberRepository memberRepository; // 닉네임으로 회원 조회

  // 팔로우 하기
  public void follow(String followerNickname, String followingNickname) {
    Member follower = memberRepository.findByNickname(followerNickname)
        .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
    Member following = memberRepository.findByNickname(followingNickname)
        .orElseThrow(() -> new IllegalArgumentException("Following not found"));

    if (followRepository.existsByFollowerAndFollowing(follower, following)) {
      throw new IllegalStateException("Already following this user");
    }

    Follow follow = new Follow(follower, following);
    followRepository.save(follow);
  }

  // 언팔로우 하기
  public void unfollow(String followerNickname, String followingNickname) {
    Member follower = memberRepository.findByNickname(followerNickname)
        .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
    Member following = memberRepository.findByNickname(followingNickname)
        .orElseThrow(() -> new IllegalArgumentException("Following not found"));

    followRepository.deleteByFollowerAndFollowing(follower, following);
  }

  // 팔로잉 목록 조회
  public List<String> getFollowings(String nickname) {
    Member member = memberRepository.findByNickname(nickname)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    return followRepository.findByFollower(member).stream()
        .map(follow -> follow.getFollowing().getNickname())
        .collect(Collectors.toList());
  }

  // 팔로워 목록 조회
  public List<String> getFollowers(String nickname) {
    Member member = memberRepository.findByNickname(nickname)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    return followRepository.findByFollowing(member).stream()
        .map(follow -> follow.getFollower().getNickname())
        .collect(Collectors.toList());
  }
}
