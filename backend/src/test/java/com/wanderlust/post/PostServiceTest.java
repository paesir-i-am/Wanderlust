package com.wanderlust.post;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.post
 * FileName       : PostTest
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오후 12:11  paesir      최초 생성
 */


import com.wanderlust.community.dto.PostRequestDTO;
import com.wanderlust.community.dto.PostResponseDTO;
import com.wanderlust.community.entity.Post;
import com.wanderlust.community.repository.PostRepository;
import com.wanderlust.community.service.FileService;
import com.wanderlust.community.service.PostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class PostServiceTest {
  @InjectMocks
  private PostServiceImpl postService;

  @Mock
  private PostRepository postRepository;

  @Mock
  private FileService fileService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void createPost_success() throws IOException {
    // Given
    PostRequestDTO requestDTO = new PostRequestDTO();
    requestDTO.setAuthorNickname("testUser");
    requestDTO.setContent("Test Content");
    MultipartFile image = mock(MultipartFile.class);

    when(fileService.saveFile(image)).thenReturn("/uploads/test_image.jpg");
    when(postRepository.save(any(Post.class))).thenAnswer(invocation -> {
      Post post = invocation.getArgument(0);
      post.setId(1L);
      return post;
    });

    // When
    PostResponseDTO response = postService.createPost(requestDTO, image);

    // Then
    assertNotNull(response);
    assertEquals("testUser", response.getAuthorNickname());
    assertEquals("Test Content", response.getContent());
    assertEquals("/uploads/test_image.jpg", response.getImageUrl());
  }

  @Test
  void getPosts_success() {
    // Given
    Post post1 = Post.builder().id(1L).authorNickname("user1").content("Content 1").build();
    Post post2 = Post.builder().id(2L).authorNickname("user2").content("Content 2").build();
    when(postRepository.findAll()).thenReturn(Arrays.asList(post1, post2));

    // When
    List<PostResponseDTO> posts = postService.getPosts();

    // Then
    assertEquals(2, posts.size());
    assertEquals("user1", posts.get(0).getAuthorNickname());
    assertEquals("user2", posts.get(1).getAuthorNickname());
  }
}

