package com.wanderlust.member.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.dto
 * FileName       : MemberRegisterDTO
 * Author         : paesir
 * Date           : 24. 12. 20.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 20.오후 2:43  paesir      최초 생성
 */

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MemberRegisterDTO {
  @Email(message = "유효한 이메일 주소를 입력해주세요")
  @NotBlank(message = "이메일은 필수 입력 값입니다")
  private String email;

  @Size(min = 8, message = "비밀번호는 최소 8자리 이상이여야 합니다")
  private String pw;

  private String nickname;
}
