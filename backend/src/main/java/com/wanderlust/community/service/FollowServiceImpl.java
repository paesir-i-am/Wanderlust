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

import com.wanderlust.community.dto.ProfileResponseDTO;
import com.wanderlust.community.entity.Follow;
import com.wanderlust.community.entity.Profile;
import com.wanderlust.community.repository.FollowRepository;
import com.wanderlust.community.repository.ProfileRepository;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowServiceImpl implements FollowService {
  private final FollowRepository followRepository;
  private final MemberRepository memberRepository;
  private final ProfileRepository profileRepository;

  // 팔로우 하기
  public void follow(String followerNickname, String followingNickname) {
    Member follower = memberRepository.findByNickname(followerNickname)
        .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
    Member following = memberRepository.findByNickname(followingNickname)
        .orElseThrow(() -> new IllegalArgumentException("Following not found"));
    Profile followerProfile = profileRepository.findByNickname(follower.getNickname())
        .orElseThrow(() -> new IllegalArgumentException("Follower profile not found"));
    Profile followingProfile = profileRepository.findByNickname(following.getNickname())
        .orElseThrow(() -> new IllegalArgumentException("Following profile not found"));

    if (followRepository.existsByFollowerAndFollowing(follower, following)) {
      throw new IllegalStateException("Already following this user");
    }

    Follow follow = new Follow(follower, following);
    followRepository.save(follow);

    followerProfile.increaseFollowings();
    followingProfile.increaseFollowers();
    profileRepository.save(followerProfile);
    profileRepository.save(followingProfile);
  }

  // 언팔로우 하기
  public void unfollow(String followerNickname, String followingNickname) {
    Member follower = memberRepository.findByNickname(followerNickname)
        .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
    Member following = memberRepository.findByNickname(followingNickname)
        .orElseThrow(() -> new IllegalArgumentException("Following not found"));
    Profile followerProfile = profileRepository.findByNickname(follower.getNickname())
            .orElseThrow(() -> new IllegalArgumentException("Follower profile not found"));
    Profile followingProfile = profileRepository.findByNickname(following.getNickname())
            .orElseThrow(() -> new IllegalArgumentException("Following profile not found"));

    followRepository.deleteByFollowerAndFollowing(follower, following);

    followerProfile.decreaseFollowings();
    followingProfile.decreaseFollowers();
    profileRepository.save(followerProfile);
    profileRepository.save(followingProfile);
  }

  // 팔로우 상태 조회
  @Override
  public boolean isFollowing(String followerNickname, String followingNickname) {
    // 팔로워와 팔로잉 사용자 정보를 조회
    Member follower = memberRepository.findByNickname(followerNickname)
        .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
    Member following = memberRepository.findByNickname(followingNickname)
        .orElseThrow(() -> new IllegalArgumentException("Following not found"));

    // 팔로우 관계가 존재하는지 확인
    return followRepository.existsByFollowerAndFollowing(follower, following);
  }

  @Override
  public Page<ProfileResponseDTO> getFollowers(String nickname, Pageable pageable) {
    return followRepository.findFollowersByNickname(nickname, pageable)
        .map(profile -> new ProfileResponseDTO(
            profile.getNickname(),
            profile.getProfileImageUrl(),
            profile.getBio(),
            profile.getFollowerCount(),
            profile.getFollowingCount()
        ));
  }

  @Override
  public Page<ProfileResponseDTO> getFollowing(String nickname, Pageable pageable) {
    return followRepository.findFollowingByNickname(nickname, pageable)
        .map(profile -> new ProfileResponseDTO(
            profile.getNickname(),
            profile.getProfileImageUrl(),
            profile.getBio(),
            profile.getFollowerCount(),
            profile.getFollowingCount()
        ));
  }

  @Override
  public long getFollowersCount(String nickname) {
    return profileRepository.findByNickname(nickname)
        .map(Profile::getFollowerCount)
        .orElseThrow(() -> new IllegalArgumentException("Profile not found(followerCount)" + nickname));
  }

  @Override
  public long getFollowingCount(String nickname) {
    return profileRepository.findByNickname(nickname)
        .map(Profile::getFollowingCount)
        .orElseThrow(() -> new IllegalArgumentException("Profile not found(followingCount)" + nickname));
  }

  }

