package com.wanderlust.community.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.controller
 * FileName       : PostController
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오후 12:02  paesir      최초 생성
 */


import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.community.dto.PostRequestDTO;
import com.wanderlust.community.dto.PostResponseDTO;
import com.wanderlust.community.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@CrossOrigin("/community/**")
@RestController
@RequestMapping("/community/posts")
public class PostController {

  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @PostMapping
  public ResponseEntity<PostResponseDTO> createPost(
      @ModelAttribute PostRequestDTO requestDto,
      @RequestParam(required = false) MultipartFile image,
      @RequestHeader("Authorization") String authorization) throws IOException {
    String token = authorization.substring(7);
    Map<String, Object> claims = JWTUtil.validateToken(token);
    String nickname = (String) claims.get("nickname");

    // 사용자 닉네임 설정
    requestDto.setAuthorNickname(nickname);

    // 게시글 생성
    PostResponseDTO response = postService.createPost(requestDto, image);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<PostResponseDTO>> getPosts(
      @RequestParam int page,
      @RequestParam int size
  ) {
    Page<PostResponseDTO> posts = postService.getPosts(PageRequest.of(page, size));
    return ResponseEntity.ok(posts);
  }

  @GetMapping("/{nickname}")
  public ResponseEntity<Page<PostResponseDTO>> getPostsByNickname(
      @PathVariable String nickname,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "9") int size) {

    PageRequest pageRequest = PageRequest.of(page, size);
    Page<PostResponseDTO> posts = postService.getPostsByAuthor(nickname, pageRequest);

    return ResponseEntity.ok(posts);
  }

  @PutMapping("/{id}")
  public ResponseEntity<PostResponseDTO> updatePost(
      @PathVariable Long id,
      @ModelAttribute PostRequestDTO requestDto,
      @RequestParam(required = false) MultipartFile image) throws IOException {
    postService.updatePost(id, requestDto, image);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePost(@PathVariable Long id) {
    postService.deletePost(id);
    return ResponseEntity.ok().build();
  }
}

