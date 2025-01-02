package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : ProfileService
 * Author         : paesir
 * Date           : 25. 1. 2.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 2.오전 12:01  paesir      최초 생성
 */


import com.wanderlust.community.dto.ProfileRequestDTO;
import com.wanderlust.community.dto.ProfileResponseDTO;
import com.wanderlust.member.dto.MemberDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
        void createProfile(MemberDTO memberDTO);
        ProfileResponseDTO getProfile(String nickname);
        ProfileResponseDTO saveOrUpdateProfile(String nickname, ProfileRequestDTO profileRequestDTO, MultipartFile profileImage);
        void deleteProfile(String nickname);

        ProfileResponseDTO getProfileByNickname(String nickname);
}
