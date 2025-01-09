package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : CommentServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오전 10:15  paesir      최초 생성
 */

import com.wanderlust.community.dto.CommentDTO;
import com.wanderlust.community.entity.Comment;
import com.wanderlust.community.entity.Post;
import com.wanderlust.community.repository.CommentRepository;
import com.wanderlust.community.repository.PostRepository;
import com.wanderlust.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment comment = dtoToEntity(commentDTO);
        Comment savedComment = commentRepository.save(comment);

        //게시물 작성자에게 알림 생성
        String recipientNickname = comment.getPost().getAuthorNickname();
        if(!comment.getAuthorNickname().equals(recipientNickname)) {
            String message = comment.getAuthorNickname() + "님이 당신의 게시물에 댓글을 달았습니다.";
            notificationService.createNotification(recipientNickname, message, "COMMENT", comment.getPost().getId());
        }

        return entityToDTO(savedComment);
    }

    @Override
    public CommentDTO createChildComment(Long parentId, CommentDTO childCommentDTO) {
        childCommentDTO.setParentId(parentId);
        CommentDTO savedcommentDTO = createComment(childCommentDTO);

        //원댓글 작성자에게 알림 생성
        Comment parent = commentRepository.findById(parentId)
            .orElseThrow(()-> new IllegalArgumentException("원 댓글을 찾을 수 없습니다."));

        String parentAuthorNickname = parent.getAuthorNickname();
        if(!childCommentDTO.getAuthorNickname().equals(parentAuthorNickname)) {
            String message = childCommentDTO.getAuthorNickname() + "님이 당신의 댓글에 대댓글을 달았습니다.";
            notificationService.createNotification(parentAuthorNickname, message, "COMMENT", parent.getId());
        }

        //게시물 작성자에게 알림 생성
        String postAuthorNickname = parent.getPost().getAuthorNickname();
        if(!childCommentDTO.getAuthorNickname().equals(postAuthorNickname) && !postAuthorNickname.equals(parentAuthorNickname)) {
            String message = childCommentDTO.getAuthorNickname() + "님이 당신의 게시물에 대댓글을 달았습니다.";
            notificationService.createNotification(postAuthorNickname, message, "COMMENT", parent.getPost().getId());
        }

        return savedcommentDTO;
    }

    @Override
    public Page<CommentDTO> getCommentsByPostId(Long postId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findAllByPostIdNotDeleted(postId, pageable);
        return comments.map(this::entityToDTO);
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO, String nickname) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다 : " + id));

        if(!comment.getAuthorNickname().equals(nickname)) {
            throw new SecurityException("댓글 수정 권한이 없습니다");
        }

        comment.setContent(commentDTO.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(comment);
        return entityToDTO(updatedComment);
    }

    @Override
    public void deleteComment(Long id, String nickname) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다 : " + id));

        if(!comment.getAuthorNickname().equals(nickname)) {
            throw new SecurityException("댓글 삭제 권한이 없습니다.");
        }

        comment.setDeleted(true);
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Override
    public List<CommentDTO> getChildComments(Long parentId) {
        Comment parentComment = commentRepository.findById(parentId)
            .orElseThrow(() -> new IllegalArgumentException("원 댓글을 찾을 수 없습니다 : " + parentId ));

        return parentComment.getChildren().stream()
            .map(this::entityToDTO)
            .collect(Collectors.toList());
    }

    private CommentDTO entityToDTO(Comment comment) {
        return CommentDTO.builder()
            .id(comment.getId())
            .postId(comment.getPost().getId())
            .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
            .content(comment.getContent())
            .authorNickname(comment.getAuthorNickname())
            .createdAt(comment.getCreatedAt())
            .updatedAt(comment.getUpdatedAt())
            .isDeleted(comment.isDeleted())
            .childComments(
                comment.getChildren() != null
                    ? comment.getChildren().stream().map(this::entityToDTO).collect(Collectors.toList())
                    : Collections.emptyList()
            )
            .build();
    }

    private Comment dtoToEntity(CommentDTO commentDTO) {
        Post post = postRepository.findById(commentDTO.getPostId()).orElseThrow(()
            -> new IllegalArgumentException("Post not found : " + commentDTO.getPostId() ));

        Comment parent = null;
        if (commentDTO.getParentId() != null) {
            parent = commentRepository.findById(commentDTO.getParentId())
                .orElseThrow(() -> new IllegalArgumentException("Parent not found : " + commentDTO.getParentId() ));
        }

        return Comment.builder()
            .post(post)
            .parent(parent)
            .content(commentDTO.getContent())
            .authorNickname(commentDTO.getAuthorNickname())
            .createdAt(LocalDateTime.now())
            .isDeleted(false)
            .build();

    }
}
