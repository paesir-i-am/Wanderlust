package com.wanderlust.community.repository;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.repository
 * FileName       : PostRepository
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오전 11:55  paesir      최초 생성
 */


import com.wanderlust.community.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface PostRepository extends JpaRepository<Post, Long> {
  @Query("SELECT p FROM Post p where p.isDeleted = false ORDER BY p.id DESC ")
  Page<Post> findAllNotDeleted(Pageable pageable);
}
