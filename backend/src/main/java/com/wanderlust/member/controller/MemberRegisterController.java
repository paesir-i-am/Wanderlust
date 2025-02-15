package com.wanderlust.member.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.controller
 * FileName       : MemberRegisterController
 * Author         : paesir
 * Date           : 24. 12. 20.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 20.오후 5:27  paesir      최초 생성
 * 24. 12. 20.오후 5:58  paesir      회원가입 메서드 생성
 */
import com.wanderlust.community.service.ProfileService;
import com.wanderlust.member.dto.MemberModifyDTO;
import com.wanderlust.member.dto.MemberRegisterDTO;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import com.wanderlust.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@Log4j2
public class MemberRegisterController {
  private final MemberService memberService;
  private final MemberRepository memberRepository;
  private final ProfileService profileService;

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody @Valid MemberRegisterDTO member) {
    log.info("Register member: {}", member);

    try {
      memberService.registerMember(member);
      Member member1 = memberService.findByEmail(member.getEmail());
      return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다" + member1);
    }catch (IllegalArgumentException e) {
      log.info("회원가입 실패 : " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }catch (Exception e) {
      log.info("회원가입 중 알 수 없는 에러 발생 : " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  @GetMapping("/checkEmail")
  public ResponseEntity<Boolean> checkEmailDuplicate(@RequestParam("email") String email) {
    boolean isDuplicate = memberService.isEmailDuplicate(email);
      return ResponseEntity.ok(isDuplicate);
  }

  @GetMapping("/checkNickname")
  public ResponseEntity<Boolean> checkNicknameDuplicate(@RequestParam("nickname") String nickname) {
    boolean isNicknameDuplicate = memberService.isNicknameDuplicate(nickname);
    return ResponseEntity.ok(isNicknameDuplicate);
  }

  @PutMapping("/modify")
  public Map<String,String> modify(@RequestBody MemberModifyDTO memberModifyDTO) {

    log.info("member modify: " + memberModifyDTO);

    memberService.modifyMember(memberModifyDTO);

    return Map.of("result","modified");

  }
}
