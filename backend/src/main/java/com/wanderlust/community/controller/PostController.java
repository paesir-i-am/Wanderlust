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


import com.wanderlust.community.dto.PostRequestDTO;
import com.wanderlust.community.dto.PostResponseDTO;
import com.wanderlust.community.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/community/posts")
public class PostController {
  @Autowired
  private PostService postService;

  @PostMapping
  public ResponseEntity<PostResponseDTO> createPost(
      @ModelAttribute PostRequestDTO requestDto,
      @RequestParam MultipartFile image) throws IOException {
    PostResponseDTO response = postService.createPost(requestDto, image);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<PostResponseDTO>> getPosts() {
    List<PostResponseDTO> posts = postService.getPosts();
    return ResponseEntity.ok(posts);
  }

  @PutMapping("/{id}")
  public ResponseEntity<PostResponseDTO> updatePost(
      @PathVariable Long id,
      @ModelAttribute PostRequestDTO requestDto,
      @RequestParam(required = false) MultipartFile image) throws IOException {
    PostResponseDTO updatedPost = postService.updatePost(id, requestDto, image);
    return ResponseEntity.ok(updatedPost);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePost(@PathVariable Long id) {
    postService.deletePost(id);
    return ResponseEntity.ok().build();
  }
}

