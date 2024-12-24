package com.wanderlust.post;

import com.wanderlust.common.util.JWTUtil;
import com.wanderlust.member.entity.Member;
import com.wanderlust.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PostControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private MemberRepository memberRepository;

  @BeforeEach
  void setUp() throws Exception {
    Path uploadDir = Paths.get("uploads");
    if(!Files.exists(uploadDir)) {
      Files.createDirectory(uploadDir);
    }
  }

  @Test
  void createPost_success() throws Exception {
    // 1. 이미 존재하는 멤버 조회
    Member existingMember = memberRepository.findByEmail("gasu93@naver.com")
        .orElseThrow(() -> new IllegalStateException("멤버를 찾을 수 없습니다."));

    // 2. JWT 생성
    String token = JWTUtil.generateToken(
        Map.of(
            "username", existingMember.getNickname(),
            "email", existingMember.getEmail(),
            "pw", existingMember.getPw(),
            "social", existingMember.isSocial(),
            "provider", existingMember.getProvider(),
            "role", "ROLE_USER"
        ),
        60 // 토큰 유효 시간 (분 단위)
    );

    MockMultipartFile image = new MockMultipartFile(
        "image",                    // 요청 파라미터 이름
        "test-image.png",          // 파일 이름
        MediaType.IMAGE_PNG_VALUE, // 파일 타입
        "Test Image Content".getBytes() // 파일 내용
    );

// 4. Post 요청 테스트
    mockMvc.perform(multipart("/community/posts")
            .file(image) // MultipartFile 추가
            .header("Authorization", "Bearer " + token)
            .param("authorNickname", existingMember.getNickname())
            .param("content", "Test Content11"))
        .andExpect(status().isOk());
  }
}
