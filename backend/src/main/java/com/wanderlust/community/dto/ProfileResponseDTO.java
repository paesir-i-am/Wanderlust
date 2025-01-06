package com.wanderlust.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
  private String nickname;
  private String bio;
  private String profileImageUrl;
  private int followerCount;
  private int followingCount;
}