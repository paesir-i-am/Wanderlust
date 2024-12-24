package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : PostService
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오전 11:57  paesir      최초 생성
 */


import com.wanderlust.community.dto.PostRequestDTO;
import com.wanderlust.community.dto.PostResponseDTO;
import com.wanderlust.community.entity.Post;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostService {
  PostResponseDTO createPost(PostRequestDTO requestDto, MultipartFile image) throws IOException;

  List<PostResponseDTO> getPosts();

  PostResponseDTO updatePost(Long id, PostRequestDTO requestDto, MultipartFile image) throws IOException;

  void deletePost(Long id);

  Post dtoToEntity(PostRequestDTO requestDto, String imageUrl);

  PostResponseDTO entityToDto(Post post);
}