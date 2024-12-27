package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : LikeServiceImpl
 * Author         : paesir
 * Date           : 24. 12. 27.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 27.오후 12:51  paesir      최초 생성
 */

import com.wanderlust.community.entity.Like;
import com.wanderlust.community.entity.Post;
import com.wanderlust.community.repository.LikeRepository;
import com.wanderlust.community.repository.PostRepository;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService {
  private final LikeRepository likeRepository;
  private final PostRepository postRepository;
  private final MemberRepository memberRepository;

  public LikeServiceImpl(LikeRepository likeRepository, PostRepository postRepository, MemberRepository memberRepository) {
    this.likeRepository = likeRepository;
    this.postRepository = postRepository;
    this.memberRepository = memberRepository;
  }

  @Override
  @Transactional
  public void toggleLike(Long id, String email) {
    Member member = memberRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Member not found"));

    Post post = postRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Post not found"));

    // 중복 확인
    Optional<Like> existingLike = likeRepository.findByPostAndMember(post, member);

    if (existingLike.isPresent()) {
      // 이미 좋아요를 누른 경우, 좋아요 취소
      likeRepository.delete(existingLike.get());
      post.decreaseLikes();
    } else {
      // 좋아요 추가
      Like like = new Like();
      like.setPost(post);
      like.setMember(member);
      like.setLiked(true);
      post.increaseLikes();
      likeRepository.save(like);
    }

    postRepository.save(post);
  }

  @Override
  @Transactional(readOnly = true)
  public int getLikesCount(Long id) {
    Post post = postRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Post not found"));
    return post.getLikesCount();
  }
}
