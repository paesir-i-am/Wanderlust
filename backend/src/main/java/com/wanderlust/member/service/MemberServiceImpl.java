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


import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.dto.MemberModifyDTO;
import com.wanderlust.member.dto.MemberRegisterDTO;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.entity.MemberRole;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.List;
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

    private String makeTempPassword() {

        StringBuffer buffer = new StringBuffer();

        // 비밀번호의 길이가 10인지 확인하기 위한 10번의 루프
        for (int i = 0; i < 10; i++) {
            // buffer에 무작위 문자 추가
            // Math.random()은 0.0(포함)에서 1.0(미포함) 사이의 무작위 double을 생성
            // 55를 곱해서 범위를 0에서 54로 설정
            // 65를 더하여 범위를 65('A')에서 119('z')로 이동
            // 결과를 char로 캐스팅하여 문자로 변환
            buffer.append((char)((int)(Math.random() * 55) + 65));
        }
        return buffer.toString();
    }


    @Override
    public boolean isEmailDuplicate(String email) {
        return memberRepository.existsByEmail(email);
    }

    // accesstoken을 기반으로 사용자의 정보를 얻기위한 메서드
    private String getEmailFromKakaoAccessToken(String accessToken){

        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if(accessToken == null){
            throw new RuntimeException("Access Token is null");
        }
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type","application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

        ResponseEntity<LinkedHashMap> response =
            restTemplate.exchange(
                uriBuilder.toString(),
                HttpMethod.GET,
                entity,
                LinkedHashMap.class);

        log.info(response);

        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();

        log.info("------------------------------");
        log.info(bodyMap);

        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

        log.info("kakaoAccount: " + kakaoAccount);

        return kakaoAccount.get("email");

    }
    // 소셜회원을 member에 넣기 위한 메서드

    private Member makeSocialMember(String email) {

        String tempPassword = makeTempPassword();

        log.info("tempPassword: " + tempPassword);

        String nickname = "소셜회원";

        Member member = Member.builder()
            .email(email)
            .pw(passwordEncoder.encode(tempPassword))
            .nickname(nickname)
            .social(true)
            .build();

        member.addRole(MemberRole.USER);

        return member;

    }

    @Override
    public MemberDTO getKakaoMember(String accessToken) {

        String email = getEmailFromKakaoAccessToken(accessToken);

        log.info("email: " + email );

        Optional<Member> result = memberRepository.findById(email);

        // 기존의 회원
        if(result.isPresent()){
            MemberDTO memberDTO = entityToDTO(result.get());

            return memberDTO;
        }

        // 회원이 아니었다면
        // 닉네임은 '소셜회원'으로
        // 패스워드는 임의로 생성
        Member socialMember = makeSocialMember(email);
        memberRepository.save(socialMember);

        MemberDTO memberDTO = entityToDTO(socialMember);

        return memberDTO;
    }
}
