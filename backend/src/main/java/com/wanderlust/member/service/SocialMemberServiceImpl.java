package com.wanderlust.member.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.service
 * FileName       : SocialMemberServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 23.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 23.오후 6:48  paesir      최초 생성
 */

import com.wanderlust.member.dto.MemberDTO;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class SocialMemberServiceImpl implements SocialMemberService {
  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;
  private final MemberService memberService;

  // accesstoken을 기반으로 사용자의 정보를 얻기위한 메서드
  private String getEmailFromKakaoAccessToken(String accessToken, LinkedHashMap<String, String> userInfo) {
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

    ResponseEntity<LinkedHashMap> response =
        restTemplate.exchange(
            uriBuilder.toString(),
            HttpMethod.GET,
            entity,
            LinkedHashMap.class);

    log.info("Response from Kakao: " + response);

    LinkedHashMap<String, Object> bodyMap = response.getBody();
    if (bodyMap == null || !bodyMap.containsKey("kakao_account")) {
      throw new RuntimeException("Kakao response does not contain 'kakao_account'.");
    }

    // 닉네임 가져오기
    LinkedHashMap<String, String> properties = (LinkedHashMap<String, String>) bodyMap.get("properties");
    String nickname = "소셜회원"; // 기본값 설정
    if (properties != null && properties.containsKey("nickname")) {
      nickname = properties.get("nickname");
    }

    log.info("Nickname from Kakao: " + nickname);

    // 이메일 가져오기
    LinkedHashMap<String, Object> kakaoAccount = (LinkedHashMap<String, Object>) bodyMap.get("kakao_account");
    String email = (String) kakaoAccount.get("email");
    if (email == null) {
      throw new RuntimeException("Email is missing from Kakao account.");
    }

    userInfo.put("nickname", nickname);
    userInfo.put("provider", "kakao");

    return email;
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

  // 소셜회원을 member에 넣기 위한 메서드
  private Member makeSocialMember(String email, LinkedHashMap<String,String> userInfo) {

    String tempPassword = makeTempPassword();

    log.info("tempPassword: " + tempPassword);

    String originalNickname = userInfo.getOrDefault("nickname", "소셜회원");
    String nickname = originalNickname;
    String provider = userInfo.getOrDefault("provider", "local");

    int suffix = 1;
    while (memberRepository.existsByNickname(nickname)) {
      nickname = originalNickname + suffix;
      suffix++;
    }

    Member member = Member.builder()
        .email(email)
        .pw(passwordEncoder.encode(tempPassword))
        .nickname(nickname)
        .social(true)
        .provider(provider)
        .build();

    member.addRole(MemberRole.USER);

    return member;

  }

  @Override
  public MemberDTO getKakaoMember(String accessToken) {

    LinkedHashMap<String,String> userInfo = new LinkedHashMap<>();

    String email = getEmailFromKakaoAccessToken(accessToken, userInfo);

    log.info("email: " + email );

    Optional<Member> result = memberRepository.findById(email);

    // 기존의 회원
    if(result.isPresent()){
      MemberDTO memberDTO = memberService.entityToDTO(result.get());

      return memberDTO;
    }

    // 신규회원 생성
    // 패스워드는 임의로 생성
    Member socialMember = makeSocialMember(email, userInfo);
    memberRepository.save(socialMember);

    MemberDTO memberDTO = memberService.entityToDTO(socialMember);

    return memberDTO;
  }
}
