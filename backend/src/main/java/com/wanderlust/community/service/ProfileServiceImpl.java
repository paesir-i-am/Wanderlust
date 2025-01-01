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
import com.wanderlust.member.entity.Member;
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
    public ProfileResponseDTO getProfile(String nickname) {
        Profile profile = profileRepository.findById(nickname)
            .orElseThrow(() -> new IllegalArgumentException("Invalid nickname" + nickname));

        return new ProfileResponseDTO(
            profile.getBio(),
            profile.getProfileImage(),
            profile.getMember().getNickname()
        );
    }

    @Override
    public ProfileResponseDTO saveOrUpdateProfile(String nickname, ProfileRequestDTO profileRequestDTO, MultipartFile profileImage) {
        Member member = memberRepository.findByNickname(nickname)
            .orElseThrow(() -> new IllegalArgumentException("Invalid nickname" + nickname));

        Profile profile = profileRepository.findById(nickname)
            .orElse(new Profile());

        String uploadedImage = null;
        if(profileImage != null && !profileImage.isEmpty()) {
            try {
                uploadedImage = fileService.saveFile(profileImage);
            }catch (IOException e) {
                throw new RuntimeException("Could not upload profile image", e);
            }
        }

        profile.setMember(member);
        profile.setBio(profileRequestDTO.getBio());
        if(uploadedImage != null) {
            profile.setProfileImage(uploadedImage);
        }

        Profile savedProfile = profileRepository.save(profile);

        return new ProfileResponseDTO(
            savedProfile.getMember().getNickname(),
            savedProfile.getBio(),
            savedProfile.getProfileImage()
        );
    }

    @Override
    public void deleteProfile(String nickname) {
        if(!profileRepository.existsById(nickname)) {
            throw new IllegalArgumentException("Invalid nickname" + nickname);
        }
        profileRepository.deleteById(nickname);
    }
}
