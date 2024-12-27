package com.wanderlust.member.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.service
 * FileName       : MemberService
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:29  paesir      최초 생성
 * 24. 12. 20.오후 5:59  paesir      register method create
 */

import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.dto.MemberModifyDTO;
import com.wanderlust.member.dto.MemberRegisterDTO;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.entity.MemberRole;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
public interface MemberService {

    void modifyMember(MemberModifyDTO memberModifyDTO);

    void registerMember(MemberRegisterDTO memberRegisterDTO);

    Member findByEmail(String email);

    boolean isEmailDuplicate(String email);

    default MemberDTO entityToDTO(Member member){

        MemberDTO dto = new MemberDTO(
            member.getEmail(),
            member.getPw(),
            member.getNickname(),
            member.isSocial(),
            member.getRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList()));
        return dto;
    }

    default Member dtoToEntity(MemberRegisterDTO memberRegisterDTO, String encodePw){
        Member member = Member.builder()
            .email(memberRegisterDTO.getEmail())
            .pw(encodePw)
            .nickname(memberRegisterDTO.getNickname())
            .provider("local")
            .RoleList(List.of(MemberRole.USER))
            .build();

        return member;
    }
}
