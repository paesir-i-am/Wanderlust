package com.wanderlust.post;

import com.wanderlust.community.dto.PostRequestDTO;
import com.wanderlust.community.dto.PostResponseDTO;
import com.wanderlust.community.entity.Post;
import com.wanderlust.community.repository.PostRepository;
import com.wanderlust.community.service.FileService;
import com.wanderlust.community.service.PostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PostServiceImplTest {

  @Mock
  private PostRepository postRepository;

  @Mock
  private FileService fileService;

  private PostServiceImpl postService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    postService = new PostServiceImpl(postRepository, fileService);
  }

  @Test
  void createPost_shouldReturnPostResponseDTO() throws IOException {
    // Arrange
    PostRequestDTO requestDTO = PostRequestDTO.builder()
        .authorNickname("Test Author")
        .content("Test Content")
        .build();

    MultipartFile mockImage = mock(MultipartFile.class);
    String mockImageUrl = "http://example.com/test-image.png";

    Post mockPost = Post.builder()
        .id(1L)
        .authorNickname("Test Author")
        .content("Test Content")
        .imageUrl(mockImageUrl)
        .createdAt(LocalDateTime.now())
        .isDeleted(false)
        .build();

    when(fileService.saveFile(mockImage)).thenReturn(mockImageUrl);
    when(postRepository.save(any(Post.class))).thenReturn(mockPost);

    // Act
    PostResponseDTO responseDTO = postService.createPost(requestDTO, mockImage);

    // Assert
    assertNotNull(responseDTO);
    assertEquals("Test Author", responseDTO.getAuthorNickname());
    assertEquals("Test Content", responseDTO.getContent());
    assertEquals(mockImageUrl, responseDTO.getImageUrl());
    verify(postRepository, times(1)).save(any(Post.class));
  }

  @Test
  void getPosts_shouldReturnListOfPostResponseDTO() {
    // Arrange
    Post mockPost1 = Post.builder()
        .id(1L)
        .authorNickname("Author1")
        .content("Content1")
        .imageUrl("http://example.com/image1.png")
        .createdAt(LocalDateTime.now())
        .isDeleted(false)
        .build();

    Post mockPost2 = Post.builder()
        .id(2L)
        .authorNickname("Author2")
        .content("Content2")
        .imageUrl("http://example.com/image2.png")
        .createdAt(LocalDateTime.now())
        .isDeleted(false)
        .build();

    when(postRepository.findAllNotDeleted()).thenReturn(Arrays.asList(mockPost1, mockPost2));

    // Act
    List<PostResponseDTO> responseDTOs = postService.getPosts();

    // Assert
    assertEquals(2, responseDTOs.size());
    assertEquals("Author1", responseDTOs.get(0).getAuthorNickname());
    assertEquals("Author2", responseDTOs.get(1).getAuthorNickname());
    verify(postRepository, times(1)).findAllNotDeleted();
  }

  @Test
  void deletePost_shouldMarkPostAsDeleted() {
    // Arrange
    Long postId = 1L;
    Post mockPost = Post.builder()
        .id(postId)
        .authorNickname("Author")
        .content("Content")
        .isDeleted(false)
        .createdAt(LocalDateTime.now())
        .build();

    when(postRepository.findById(postId)).thenReturn(Optional.of(mockPost));

    // Act
    postService.deletePost(postId);

    // Assert
    assertTrue(mockPost.getIsDeleted());
    verify(postRepository, times(1)).findById(postId);
    verify(postRepository, times(1)).save(mockPost); // 논리 삭제된 상태로 저장
  }

  @Test
  void getPosts_shouldExcludeDeletedPosts() {
    // Arrange
    Post mockPost1 = Post.builder()
        .id(1L)
        .authorNickname("Author1")
        .content("Content1")
        .isDeleted(false)
        .createdAt(LocalDateTime.now())
        .build();

    Post mockPost2 = Post.builder()
        .id(2L)
        .authorNickname("Author2")
        .content("Content2")
        .isDeleted(true) // 삭제된 게시물
        .createdAt(LocalDateTime.now())
        .build();

    when(postRepository.findAllNotDeleted()).thenReturn(List.of(mockPost1));

    // Act
    List<PostResponseDTO> responseDTOs = postService.getPosts();

    // Assert
    assertEquals(1, responseDTOs.size()); // 삭제되지 않은 게시물만 반환
    assertEquals("Author1", responseDTOs.get(0).getAuthorNickname());
    verify(postRepository, times(1)).findAllNotDeleted(); // findAllNotDeleted 호출 검증
  }
}
