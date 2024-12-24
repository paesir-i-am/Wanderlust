package com.wanderlust.member.repository;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.repository
 * FileName       : MemberRepository
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:24  paesir      최초 생성
 * 24. 12. 20.오후 5:59  paesir      register method create
 */


import com.wanderlust.member.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    // 이메일이 일치한다면 즉시로딩 시켜라.
    // attributePaths 로 즉시로딩 처리를 진행할수 있다.
    @EntityGraph(attributePaths = {"RoleList"})
    @Query("select m from Member m where m.email = :email")
    Member getWithRoles(@Param("email") String email);

    boolean existsByEmail(@Email(message = "유효한 이메일 주소를 입력해주세요")
                          @NotBlank(message = "이메일은 필수 입력 값입니다") String email);

    boolean existsByNickname(String nickname);

    Optional<Member> findByEmail(String email);



}