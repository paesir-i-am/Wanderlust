package com.wanderlust.community.controller;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.controller
 * FileName       : ProfileController
 * Author         : paesir
 * Date           : 25. 1. 2.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 2.오전 12:11  paesir      최초 생성
 */

import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.community.dto.ProfileRequestDTO;
import com.wanderlust.community.dto.ProfileResponseDTO;
import com.wanderlust.community.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/community/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    // 프로필 조회
    @GetMapping("/{nickname}")
    public ResponseEntity<ProfileResponseDTO> getProfile(@PathVariable String nickname) {
        ProfileResponseDTO profile = profileService.getProfile(nickname);
        return ResponseEntity.ok(profile);
    }

    // 프로필 생성/수정
    @PostMapping("/{nickname}")
    public ResponseEntity<ProfileResponseDTO> saveOrUpdateProfile(
        @PathVariable String nickname,
        @RequestPart("profileData") ProfileRequestDTO requestDTO,
        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
        @RequestHeader("Authorization") String authorization) {

        // JWT 검증 및 닉네임 추출
        String token = authorization.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(token);
        String tokenNickname = (String) claims.get("nickname");

        // 닉네임 비교
        if (!nickname.equals(tokenNickname)) {
            return ResponseEntity.status(403).build(); // 권한 없음
        }

        ProfileResponseDTO savedProfile = profileService.saveOrUpdateProfile(nickname, requestDTO, profileImage);
        return ResponseEntity.ok(savedProfile);
    }

    // 프로필 삭제
    @DeleteMapping("/{nickname}")
    public ResponseEntity<Void> deleteProfile(
        @PathVariable String nickname,
        @RequestHeader("Authorization") String authorization) {

        // JWT 검증 및 닉네임 추출
        String token = authorization.substring(7);
        Map<String, Object> claims = JWTUtil.validateToken(token);
        String tokenNickname = (String) claims.get("nickname");

        if (!nickname.equals(tokenNickname)) {
            return ResponseEntity.status(403).build();
        }

        profileService.deleteProfile(nickname);
        return ResponseEntity.noContent().build();
    }
}
