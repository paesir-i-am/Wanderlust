package com.wanderlust.member.repository;

/*
 * Description    : 멤버 Jpa Repository
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.repository
 * FileName       : MemberRepository
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 2:46  paesir      최초 생성
 */


import com.wanderlust.member.domain.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
  Optional<Member> findByEmail(String email);
  boolean existsById(Long id);

  @EntityGraph(attributePaths = {"memberRoleList"})
  @Query("select m from Member m where m.email = :email")
  Member getWithRoles(@Param("email") String email);

  Long id(Long id);
}
