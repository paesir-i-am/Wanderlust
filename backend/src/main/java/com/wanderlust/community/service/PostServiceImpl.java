package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : PostServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오전 11:59  paesir      최초 생성
 */


import com.wanderlust.community.dto.PostRequestDTO;
import com.wanderlust.community.dto.PostResponseDTO;
import com.wanderlust.community.entity.Post;
import com.wanderlust.community.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Pageable;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class PostServiceImpl implements PostService {
  private final PostRepository postRepository;
  private final FileService fileService;

  public PostServiceImpl(PostRepository postRepository, FileService fileService) {
    this.postRepository = postRepository;
    this.fileService = fileService;
  }

  @Override
  public PostResponseDTO createPost(PostRequestDTO requestDto, MultipartFile image) throws IOException {
    String imageUrl = fileService.saveFile(image);
    Post post = dtoToEntity(requestDto, imageUrl);
    Post savedPost = postRepository.save(post);
    return entityToDto(savedPost);
  }

  @Override
  public Page<PostResponseDTO> getPosts(PageRequest pageRequest) {
      return postRepository.findAllNotDeleted(pageRequest)
          .map(post -> entityToDto(post));
    }

  @Override
  public Post dtoToEntity(PostRequestDTO requestDto, String imageUrl) {
    return Post.builder()
        .authorNickname(requestDto.getAuthorNickname())
        .content(requestDto.getContent())
        .imageUrl(imageUrl)
        .createdAt(LocalDateTime.now())
        .build();
  }

  @Override
  public PostResponseDTO entityToDto(Post post) {
    return PostResponseDTO.builder()
        .id(post.getId())
        .authorNickname(post.getAuthorNickname())
        .content(post.getContent())
        .imageUrl(post.getImageUrl())
        .createdAt(post.getCreatedAt())
        .build();
  }

  @Override
  public PostResponseDTO updatePost(Long id, PostRequestDTO requestDto, MultipartFile image) throws IOException {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

    if (requestDto.getContent() != null) {
      post.setContent(requestDto.getContent());
    }
    if (image != null) {
      String imageUrl = fileService.saveFile(image);
      post.setImageUrl(imageUrl);
    }
    Post updatedPost = postRepository.save(post);
    return entityToDto(updatedPost);
  }

  @Override
  public void deletePost(Long id) {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + id));

    post.markAsDeleted();
    postRepository.save(post);
  }
}
