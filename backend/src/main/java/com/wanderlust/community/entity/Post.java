package com.wanderlust.community.entity;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.entity
 * FileName       : Post
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오전 11:53  paesir      최초 생성
 */

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String authorNickname;
  private String content;
  private String imageUrl;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @Builder.Default
  private Boolean isDeleted = false;

  public void updatePost(String content, String imageUrl) {
    if (content != null && !content.isEmpty()) {
      this.content = content;
    }
    if (imageUrl != null && !imageUrl.isEmpty()) {
      this.imageUrl = imageUrl;
    }
    this.updatedAt = LocalDateTime.now();
  }

  public void markAsDeleted() {
    this.isDeleted = true;
    this.updatedAt = LocalDateTime.now();
  }

  public void restore() {
    this.isDeleted = false;
    this.updatedAt = LocalDateTime.now();
  }

  @Column(nullable = false)
  @Builder.Default
  private int likesCount = 0;

  public void increaseLikes() {
    this.likesCount++;
  }

  public void decreaseLikes() {
    this.likesCount--;
  }
}
