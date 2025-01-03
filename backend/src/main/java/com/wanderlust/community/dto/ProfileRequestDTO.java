package com.wanderlust.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.dto
 * FileName       : ProfileRequestDTO
 * Author         : paesir
 * Date           : 25. 1. 2.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 2.오전 12:00  paesir      최초 생성
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequestDTO {
  private String bio;
  private String profileImageUrl;
}
