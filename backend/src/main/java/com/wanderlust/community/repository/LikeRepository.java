package com.wanderlust.community.repository;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.repository
 * FileName       : LikeRepository
 * Author         : paesir
 * Date           : 24. 12. 27.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 27.오후 12:43  paesir      최초 생성
 */


import com.wanderlust.community.entity.Like;
import com.wanderlust.community.entity.Post;
import com.wanderlust.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
  Optional<Like> findByPostAndMember(Post post, Member member);

  boolean existsByPostAndMember(Post post, Member member);
}
