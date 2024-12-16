package com.wanderlust.member.repository;

/*
 * Description    : 소셜 멤버 JPA Repository
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.repository
 * FileName       : MemberSocialRepository
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 2:48  paesir      최초 생성
 */


import com.wanderlust.member.domain.MemberSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface MemberSocialRepository extends JpaRepository<MemberSocial, Long> {
  Optional<MemberSocial> findByProviderAndProviderUserId(String provider, String providerUserId);
}
