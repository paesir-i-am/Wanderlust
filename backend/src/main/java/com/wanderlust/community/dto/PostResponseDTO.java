package com.wanderlust.community.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.dto
 * FileName       : PostResponseDTO
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오전 11:56  paesir      최초 생성
 */

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponseDTO {
  private Long id;
  private String authorNickname;
  private String content;
  private String imageUrl;
  private LocalDateTime createdAt;
}
