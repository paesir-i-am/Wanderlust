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
import com.wanderlust.community.dto.ProfileResponseDTO;
import com.wanderlust.community.entity.Post;
import com.wanderlust.community.repository.PostRepository;
import com.wanderlust.notification.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Transactional
public class PostServiceImpl implements PostService {
  private final PostRepository postRepository;
  private final FileService fileService;
  private final FollowService followService;
  private final NotificationService notificationService;

  public PostServiceImpl(PostRepository postRepository, FileService fileService, FollowService followService, NotificationService notificationService) {
    this.postRepository = postRepository;
    this.fileService = fileService;
    this.followService = followService;
    this.notificationService = notificationService;
  }

  @Override
  public PostResponseDTO createPost(PostRequestDTO requestDto, MultipartFile image) throws IOException {
    String imageUrl = fileService.saveFile(image);
    Post post = dtoToEntity(requestDto, imageUrl);
    Post savedPost = postRepository.save(post);

    //팔로워 목록 조회 및 알림 생성
    Page<ProfileResponseDTO> followers = followService.getFollowers(requestDto.getAuthorNickname(), Pageable.unpaged());

    for(ProfileResponseDTO follower : followers) {
      String message = requestDto.getAuthorNickname() + "님이 새 글을 작성했습니다.";
      notificationService.createNotification(follower.getNickname(), message,"POST", post.getId());
    }

    return entityToDto(savedPost);
  }

  @Override
  public Page<PostResponseDTO> getPosts(PageRequest pageRequest) {
    // PageRequest 검증
    if (pageRequest.getPageNumber() < 0 || pageRequest.getPageSize() <= 0) {
      throw new IllegalArgumentException("Invalid page request parameters.");
    }
    Page<Post> posts = postRepository.findAllNotDeleted(pageRequest);
    return posts.map(this::entityToDto);
  }

  @Override
  public void updatePost(Long id, PostRequestDTO requestDto, MultipartFile image) throws IOException {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

    String imageUrl = null;
    if (image != null && !image.isEmpty()) {
      imageUrl = fileService.saveFile(image);
    }
    post.updatePost(requestDto.getContent(), imageUrl);
    postRepository.save(post);
  }

  @Override
  public void deletePost(Long id) {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + id));

    post.markAsDeleted();
    postRepository.save(post);
  }

  @Override
  public Page<PostResponseDTO> getPostsByAuthor(String authorNickname, PageRequest pageRequest) {
    if(pageRequest.getPageNumber() < 0 || pageRequest.getPageSize() <= 0) {
      throw new IllegalArgumentException("Invalid page request parameters.");
    }

    Page<Post> posts = postRepository.findAllNotDeletedByAuthorNickname(authorNickname, pageRequest);

    return posts.map(this::entityToDto);
  }

  @Override
  public Post dtoToEntity(PostRequestDTO requestDto, String imageUrl) {
    return Post.builder()
        .authorNickname(requestDto.getAuthorNickname())
        .content(requestDto.getContent())
        .imageUrl(imageUrl)
        .likesCount(0)
        .createdAt(LocalDateTime.now())
        .updatedAt(null)
        .isDeleted(false)
        .build();
  }

  @Override
  public PostResponseDTO entityToDto(Post post) {
    return PostResponseDTO.builder()
        .id(post.getId())
        .authorNickname(post.getAuthorNickname())
        .content(post.getContent())
        .imageUrl(post.getImageUrl())
        .likesCount(post.getLikesCount())
        .createdAt(post.getCreatedAt())
        .updatedAt(post.getUpdatedAt())
        .build();
  }
}
