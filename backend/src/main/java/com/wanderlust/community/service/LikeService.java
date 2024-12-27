package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : LikeService
 * Author         : paesir
 * Date           : 24. 12. 27.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 27.오후 12:50  paesir      최초 생성
 */


public interface LikeService {
    void toggleLike(Long id, String Email);

    int getLikesCount(Long id);
}
