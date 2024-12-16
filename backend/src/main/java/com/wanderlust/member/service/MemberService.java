package com.wanderlust.member.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.service
 * FileName       : MemberService
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 3:13  paesir      최초 생성
 */


import com.wanderlust.member.domain.Member;
import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.dto.MemberModifyDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Transactional
public interface MemberService {
  Member registerOrUpdateSocialMember(String provider, String providerUserId, String email, String name);
  void modifyMember(MemberModifyDTO memberModifyDTO);

  MemberDTO getKakaoMember(String accessToken);


  default MemberDTO entityToDTO(Member member){
    MemberDTO dto = new MemberDTO(
        member.getId(),
        member.getName(),
        member.getEmail(),
        member.isSocial(),
        member.getSocialAccounts().isEmpty() ? null : member.getSocialAccounts().get(0).getProvider(),
        member.getSocialAccounts().isEmpty() ? null : member.getSocialAccounts().get(0).getProviderUserId(),
        member.getMemberRoleList().stream()
            .map(role -> role.name()) // Enum -> String 변환
            .collect(Collectors.toList())
    );
    return dto;
  }

}
