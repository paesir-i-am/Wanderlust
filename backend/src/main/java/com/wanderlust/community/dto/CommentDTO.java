package com.wanderlust.community.dto;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.dto
 * FileName       : CommentDTO
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오전 10:01  paesir      최초 생성
 */


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
  private Long id;
  private Long postId;
  private Long parentId;
  private List<CommentDTO> childComments;
  private String content;
  private String authorNickname;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private boolean isDeleted;
}
