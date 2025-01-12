package com.wanderlust.community.entity;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.entity
 * FileName       : Comment
 * Author         : paesir
 * Date           : 24. 12. 30.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 30.오전 9:57  paesir      최초 생성
 */


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> children = new ArrayList<>();

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String authorNickname;

    @Column(nullable = false)
    private boolean isDeleted = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

  public void updateContent(String newContent) {
    if (newContent != null && !newContent.isEmpty()) {
      this.content = newContent;
      this.updatedAt = LocalDateTime.now();
    }
  }

  public void delete() {
    this.isDeleted = true;
    this.updatedAt = LocalDateTime.now();
  }

  public void restore() {
    this.isDeleted = false;
    this.updatedAt = LocalDateTime.now();
  }
}
