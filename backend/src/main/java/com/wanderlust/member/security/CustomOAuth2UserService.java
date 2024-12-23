package com.wanderlust.member.security;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.security
 * FileName       : CustomOAuth2UserService
 * Author         : paesir
 * Date           : 24. 12. 23.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 23.오후 12:02  paesir      최초 생성
 */


import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.entity.MemberRole;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    log.info("Processing OAuth2 login...");
    OAuth2User oAuth2User = super.loadUser(userRequest);

    ClientRegistration clientRegistration = userRequest.getClientRegistration();
    String clientName = clientRegistration.getClientName();
    log.info("Client Name: {}", clientName);

    Map<String, Object> attributes = oAuth2User.getAttributes();
    String email = null;
    String nickname = null;

    if ("kakao".equalsIgnoreCase(clientName)) {
      email = getKakaoEmail(attributes);
      nickname = getKakaoNickname(attributes);
    }

    return processSocialLogin(email, nickname, attributes);
  }

  private String getKakaoEmail(Map<String, Object> attributes) {
    LinkedHashMap<String, Object> kakaoAccount = (LinkedHashMap<String, Object>) attributes.get("kakao_account");
    return (String) kakaoAccount.get("email");
  }

  private String getKakaoNickname(Map<String, Object> attributes) {
    LinkedHashMap<String, Object> kakaoAccount = (LinkedHashMap<String, Object>) attributes.get("kakao_account");
    LinkedHashMap<String, Object> profile = (LinkedHashMap<String, Object>) kakaoAccount.get("profile");

    // 닉네임이 없으면 임의 닉네임 생성
    String nickname = (String) profile.get("nickname");
    if (nickname == null || nickname.isEmpty()) {
      nickname = generateRandomNickname();
    }
    return nickname;
  }

  private OAuth2User processSocialLogin(String email, String nickname, Map<String, Object> attributes) {
    Optional<Member> result = memberRepository.findByEmail(email);

    Member member = result.orElseGet(() -> {
      String tempPassword = generateTempPassword();
      Member newMember = Member.builder()
          .email(email)
          .pw(passwordEncoder.encode(tempPassword))
          .nickname(nickname)
          .social(true)
          .build();
      newMember.addRole(MemberRole.USER);
      memberRepository.save(newMember);
      return newMember;
    });

    MemberDTO memberDTO = new MemberDTO(
        member.getEmail(),
        member.getPw(),
        member.getNickname(),
        member.isSocial(),
        member.getRoleList().stream().map(MemberRole::name).collect(Collectors.toList())
    );

    memberDTO.setProps(attributes);

    return memberDTO;
  }

  private String generateRandomNickname() {
    String prefix = "social";
    int randomNumber = new SecureRandom().nextInt(10000);
    return prefix + randomNumber;
  }

  private String generateTempPassword() {
    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    SecureRandom random = new SecureRandom();
    StringBuilder buffer = new StringBuilder();
    for (int i = 0; i < 10; i++) {
      buffer.append(chars.charAt(random.nextInt(chars.length())));
    }
    return buffer.toString();
  }
}
