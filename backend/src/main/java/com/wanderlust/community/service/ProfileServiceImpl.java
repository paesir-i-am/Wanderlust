package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : ProfileServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 2.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 2.오전 12:02  paesir      최초 생성
 */

import com.wanderlust.community.dto.ProfileRequestDTO;
import com.wanderlust.community.dto.ProfileResponseDTO;
import com.wanderlust.community.entity.Profile;
import com.wanderlust.community.repository.ProfileRepository;
import com.wanderlust.member.dto.MemberDTO;
import com.wanderlust.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
  private final ProfileRepository profileRepository;
  private final MemberRepository memberRepository;
  private final FileService fileService;

  @Override
  public ProfileResponseDTO getProfile(String email) {
    Profile profile = profileRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("Invalid email (getProfile)" + email));

    return new ProfileResponseDTO(
        profile.getBio(),
        profile.getProfileImageUrl(),
        profile.getMember().getNickname(),
        profile.getFollowerCount(),
        profile.getFollowingCount()
    );
  }

  @Override
  public void saveOrUpdateProfile(String nickname, ProfileRequestDTO profileRequestDTO, MultipartFile profileImage) throws IOException {

    Profile profile = profileRepository.findByNickname(nickname)
        .orElseThrow(() -> new IllegalArgumentException("Invalid nickname (getProfile)" + nickname));

    String profileImageUrl = null;
    if (profileImage != null && !profileImage.isEmpty()) {
      profileImageUrl = fileService.saveFile(profileImage);
    }
    profile.updateProfile(profileRequestDTO.getBio(), profileImageUrl);
    profileRepository.save(profile);
  }

  @Override
  public void deleteProfile(String email) {
    if (!profileRepository.existsById(email)) {
      throw new IllegalArgumentException("Invalid nickname (deleteProfile)" + email);
    }
    profileRepository.deleteById(email);
  }

  @Override
  public void createProfile(MemberDTO memberDTO) {
    Profile profile = Profile.builder()
        .email(memberDTO.getEmail())
        .nickname(memberDTO.getNickname())
        .bio(null)
        .profileImageUrl(null)
        .build();

    profileRepository.save(profile);

  }

  @Override
  public ProfileResponseDTO getProfileByNickname(String nickname) {
    Profile profile = profileRepository.findByNickname(nickname)
        .orElseThrow(() -> new IllegalArgumentException("Invalid nickname (profileByNickname)" + nickname));

    return new ProfileResponseDTO(
        profile.getNickname(),
        profile.getBio(),
        profile.getProfileImageUrl(),
        profile.getFollowerCount(),
        profile.getFollowingCount()
    );
  }
}
