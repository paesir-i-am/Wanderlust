package com.wanderlust.member.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.member.dto
 * FileName       : MemberModifyDTO
 * Author         : paesir
 * Date           : 24. 12. 13.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 13.오후 4:44  paesir      최초 생성
 */

import lombok.Data;

@Data
public class MemberModifyDTO {
  private String email;
  private String name;
  private String password;
}
