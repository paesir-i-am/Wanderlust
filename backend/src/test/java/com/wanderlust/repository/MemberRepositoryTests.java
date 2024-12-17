package com.wanderlust.repository;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.repository
 * FileName       : MemberRepositoryTests
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 3:32  paesir      최초 생성
 */

import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
@Log4j2
public class MemberRepositoryTests {
  @Autowired
  private MemberRepository memberRepository;
  @Autowired
  private PasswordEncoder passwordEncoder;


  @Test
  public void getMember(){
    String email = "email100@aaa.bbb";
    Member member = memberRepository.getWithRoles(email);
    log.info(member);
  }
}
