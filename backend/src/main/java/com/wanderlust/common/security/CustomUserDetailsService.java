package com.wanderlust.common.security;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.common.security
 * FileName       : CustomUserDetailsService
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 5:43  paesir      최초 생성
 */


import com.wanderlust.member.domain.Member;
import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
//스프링 시큐리티는 사용자의 인증 처리를 위해서 UserDetailsService라는 인터페이스의 구현체를 활용한다.
public class CustomUserDetailsService implements UserDetailsService {

  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    log.info("----------------loadUserByUsername-----------------------------");


    Member member = memberRepository.getWithRoles(username);

    if (member == null) {
      throw new UsernameNotFoundException("Not Found");
    }

    MemberDTO memberDTO = new MemberDTO(
        member.getId(),
        member.getName(),
        member.getEmail(),
        member.isSocial(),
        member.getMemberRoleList()
            .stream()
            .map(memberRole -> memberRole.name()).collect(Collectors.toList()));

    log.info(memberDTO);

    return memberDTO;


  }

}
