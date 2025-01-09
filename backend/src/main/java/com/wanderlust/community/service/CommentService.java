package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : CommentService
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오전 10:10  paesir      최초 생성
 */


import com.wanderlust.community.dto.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {
  Page<CommentDTO> getCommentsByPostId(Long postId, Pageable pageable);
  CommentDTO createComment(CommentDTO commentDTO);
  CommentDTO createChildComment(Long parentId, CommentDTO childCommentDTO);
  CommentDTO updateComment(Long id, CommentDTO commentDTO, String nickname);
  void deleteComment(Long id, String nickname);
  List<CommentDTO> getChildComments(Long parentId);
}
