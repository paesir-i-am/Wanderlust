package com.wanderlust.community.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.controller
 * FileName       : CommentController
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오전 10:21  paesir      최초 생성
 */

import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.community.dto.CommentDTO;
import com.wanderlust.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/community/comments")
public class CommentController {
    private final CommentService commentService;

    // 댓글 조회
    @GetMapping
    public ResponseEntity<Page<CommentDTO>> getComments(
        @RequestParam Long postId,
        Pageable pageable
    ) {
        Page<CommentDTO> comments = commentService.getCommentsByPostId(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    // 댓글 생성
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
        @RequestBody CommentDTO commentDto,
        @RequestHeader("Authorization") String authorization
    ) {
        String token = authorization.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(token);
        String nickname = (String) claims.get("nickname");

        // 닉네임 설정
        commentDto.setAuthorNickname(nickname);

        // 댓글 생성
        CommentDTO createdComment = commentService.createComment(commentDto);
        return ResponseEntity.ok(createdComment);
    }

    // 대댓글 생성
    @PostMapping("/{parentId}/child")
    public ResponseEntity<CommentDTO> createChildComment(
        @PathVariable Long parentId,
        @RequestBody CommentDTO childCommentDto,
        @RequestHeader("Authorization") String authorization
    ) {
        String token = authorization.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(token);
        String nickname = (String) claims.get("nickname");

        // 닉네임 설정
        childCommentDto.setAuthorNickname(nickname);

        // 대댓글 생성
        CommentDTO createdChildComment = commentService.createChildComment(parentId, childCommentDto);
        return ResponseEntity.ok(createdChildComment);
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
        @PathVariable Long id,
        @RequestBody CommentDTO commentDto,
        @RequestHeader("Authorization") String authorization
    ) {
        String token = authorization.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(token);
        String nickname = (String) claims.get("nickname");

        CommentDTO updatedComment = commentService.updateComment(id, commentDto, nickname);
        return ResponseEntity.ok(updatedComment);
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authorization
    ) {
        String token = authorization.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(token);
        String nickname = (String) claims.get("nickname");

        commentService.deleteComment(id, nickname);
        return ResponseEntity.noContent().build();
    }
}
