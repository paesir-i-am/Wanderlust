package com.wanderlust.member.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.service
 * FileName       : MemberServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 16.오후 2:30  paesir      최초 생성
 * 24. 12. 20.오후 5:59  paesir      register method create
 */


import com.wanderlust.member.dto.MemberModifyDTO;
import com.wanderlust.member.dto.MemberRegisterDTO;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void registerMember(MemberRegisterDTO memberRegisterDTO) {
        // 이메일 중복 확인
        if (memberRepository.existsByEmail(memberRegisterDTO.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String encodePw = passwordEncoder.encode(memberRegisterDTO.getPw());

        Member member = dtoToEntity(memberRegisterDTO, encodePw);

        memberRepository.save(member);
    }


    @Override
    public void modifyMember(MemberModifyDTO memberModifyDTO) {

        Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());

        Member member = result.orElseThrow();

        member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
        member.changeSocial(false);
        member.changeNickname(memberModifyDTO.getNickname());

        memberRepository.save(member);

    }

    @Override
    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("해당 이메일로 등록된 사용자를 찾을 수 없습니다"));
    }




    @Override
    public boolean isEmailDuplicate(String email) {
        return memberRepository.existsByEmail(email);
    }

}
