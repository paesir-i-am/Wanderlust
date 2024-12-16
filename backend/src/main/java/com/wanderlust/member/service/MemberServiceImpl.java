package com.wanderlust.member.service;/*
package com.wanderlust.member.service;

*/
/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.service
 * FileName       : MemberServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 3:14  paesir      최초 생성
 */


import com.wanderlust.member.domain.Member;
import com.wanderlust.member.domain.MemberRole;
import com.wanderlust.member.domain.MemberSocial;
import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.dto.MemberModifyDTO;
import com.wanderlust.member.repository.MemberRepository;
import com.wanderlust.member.repository.MemberSocialRepository;
import com.wanderlust.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class MemberServiceImpl implements MemberService {
  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  // 카카오 API에서 이메일 및 이름 가져오기
  private LinkedHashMap<String, String> getUserInfoFromKakao(String accessToken) {
    String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

    if (accessToken == null) {
      throw new RuntimeException("Access Token is null");
    }

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "Bearer " + accessToken);
    headers.add("Content-Type", "application/x-www-form-urlencoded");
    HttpEntity<String> entity = new HttpEntity<>(headers);

    UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

    ResponseEntity<LinkedHashMap> response = restTemplate.exchange(
        uriBuilder.toString(),
        HttpMethod.GET,
        entity,
        LinkedHashMap.class
    );

    log.info("Kakao API Response: {}", response);

    LinkedHashMap<String, Object> bodyMap = response.getBody();
    if (bodyMap == null || !bodyMap.containsKey("kakao_account")) {
      throw new RuntimeException("Invalid response from Kakao API");
    }

    LinkedHashMap<String, Object> kakaoAccount = (LinkedHashMap<String, Object>) bodyMap.get("kakao_account");
    if (kakaoAccount == null || !kakaoAccount.containsKey("email")) {
      throw new RuntimeException("Email not found in Kakao account");
    }

    // profile 값 처리
    Object profileObj = kakaoAccount.get("profile");
    if (!(profileObj instanceof LinkedHashMap)) {
      throw new RuntimeException("Profile data is not in the expected format");
    }

    LinkedHashMap<String, String> profile = (LinkedHashMap<String, String>) profileObj;
    if (profile == null || !profile.containsKey("nickname")) {
      throw new RuntimeException("Nickname not found in Kakao profile");
    }

    LinkedHashMap<String, String> userInfo = new LinkedHashMap<>();
    userInfo.put("email", kakaoAccount.get("email").toString());
    userInfo.put("name", profile.get("nickname"));

    return userInfo;
  }


  // 임시 비밀번호 생성
  private String makeTempPassword() {
    StringBuilder buffer = new StringBuilder();
    for (int i = 0; i < 10; i++) {
      buffer.append((char) ((int) (Math.random() * 55) + 65));
    }
    return buffer.toString();
  }

  // 소셜 회원 생성
  private Member makeSocialMember(String email, String name) {
    String tempPassword = makeTempPassword();

    log.info("tempPassword: {}", tempPassword);

    Member member = Member.builder()
        .email(email)
        .password(passwordEncoder.encode(tempPassword))
        .name(name)
        .isSocial(true)
        .build();

    member.addRole(MemberRole.USER);

    return member;
  }

  @Override
  public MemberDTO getKakaoMember(String accessToken) {
    LinkedHashMap<String, String> userInfo = getUserInfoFromKakao(accessToken);
    String email = userInfo.get("email");
    String name = userInfo.get("name");

    log.info("email: {}, name: {}", email, name);

    Optional<Member> result = memberRepository.findByEmail(email);

    // 기존 회원 처리
    if (result.isPresent()) {
      MemberDTO memberDTO = entityToDTO(result.get());
      return memberDTO;
    }

    // 새로운 회원 처리
    Member socialMember = makeSocialMember(email, name);
    memberRepository.save(socialMember);

    MemberDTO memberDTO = entityToDTO(socialMember);
    return memberDTO;
  }

  @Override
  public void modifyMember(MemberModifyDTO memberModifyDTO) {
    if (memberModifyDTO.getEmail() == null || memberModifyDTO.getPassword() == null || memberModifyDTO.getName() == null) {
      throw new IllegalArgumentException("Invalid input data for modifying member");
    }

    Optional<Member> result = memberRepository.findByEmail(memberModifyDTO.getEmail());

    Member member = result.orElseThrow(() -> new RuntimeException("Member not found with email: " + memberModifyDTO.getEmail()));

    member.changePassword(passwordEncoder.encode(memberModifyDTO.getPassword()));
    member.changeName(memberModifyDTO.getName());

    memberRepository.save(member);
  }

  @Override
  public Member registerOrUpdateSocialMember(String provider, String providerUserId, String email, String name) {
    Optional<Member> result = memberRepository.findByEmail(email);

    if (result.isPresent()) {
      Member existingMember = result.get();
      existingMember.changeName(name);
      existingMember.changeSocialStatus(true);
      existingMember.addRole(MemberRole.USER);
      memberRepository.save(existingMember);
      return existingMember;
    }

    Member newMember = Member.builder()
        .email(email)
        .password(passwordEncoder.encode(makeTempPassword()))
        .name(name)
        .isSocial(true)
        .build();
    newMember.addRole(MemberRole.USER);

    memberRepository.save(newMember);

    return newMember;
  }
}
