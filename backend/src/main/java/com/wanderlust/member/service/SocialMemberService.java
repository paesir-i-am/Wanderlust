package com.wanderlust.member.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.service
 * FileName       : SocialMemberService
 * Author         : paesir
 * Date           : 24. 12. 23.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 23.오후 6:46  paesir      최초 생성
 */

import com.wanderlust.member.dto.MemberDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface SocialMemberService {
  MemberDTO getKakaoMember(String accessToken );
}
