package com.wanderlust.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProfileResponseDTO {
  private String nickname;
  private String bio;
  private String profileImage;
  private int followerCount;
  private int followingCount;
}