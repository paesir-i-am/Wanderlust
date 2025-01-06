package com.wanderlust.tourlist.service;

import com.wanderlust.tourlist.dto.TourListDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface TourListLikeService {

    // 좋아요 데이터 조회
    List<TourListDTO> getLikedToursByUser(String userId);

    // 좋아요 데이터 추가
    String addLike(String userId, Long tourId);

    // 좋아요 데이터 삭제
    void removeLike(String userId, Long tourId);
}