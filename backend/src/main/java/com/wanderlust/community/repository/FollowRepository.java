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
import com.wanderlust.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
  boolean existsByFollowerAndFollowing(Member follower, Member following);
  List<Follow> findByFollower(Member follower);
  List<Follow> findByFollowing(Member following);
  void deleteByFollowerAndFollowing(Member follower, Member following);
}
