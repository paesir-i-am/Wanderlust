package com.wanderlust.community.repository;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.repository
 * FileName       : FollowRepository
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오후 5:03  paesir      최초 생성
 */


import com.wanderlust.community.entity.Follow;
import com.wanderlust.community.entity.Profile;
import com.wanderlust.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FollowRepository extends JpaRepository<Follow, Long> {
  boolean existsByFollowerAndFollowing(Member follower, Member following);
  void deleteByFollowerAndFollowing(Member follower, Member following);
  // 팔로워 목록 (해당 사용자를 팔로우하는 프로필들)
  @Query("SELECT p FROM Follow f JOIN Profile p ON f.follower.nickname = p.nickname WHERE f.following.nickname = :nickname")
  Page<Profile> findFollowersByNickname(@Param("nickname") String nickname, Pageable pageable);

  // 팔로잉 목록 (해당 사용자가 팔로우하는 프로필들)
  @Query("SELECT p FROM Follow f JOIN Profile p ON f.following.nickname = p.nickname WHERE f.follower.nickname = :nickname")
  Page<Profile> findFollowingByNickname(@Param("nickname") String nickname, Pageable pageable);
}
