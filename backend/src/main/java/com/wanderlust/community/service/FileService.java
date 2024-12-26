package com.wanderlust.community.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class FileService {
  private final String uploadDir = "uploads";

  public String saveFile(MultipartFile file) throws IOException {

    // uploads 디렉토리 생성 확인
    File uploadDirFile = new File(uploadDir);
    if (!uploadDirFile.exists()) {
      uploadDirFile.mkdirs();
    }

    if (file.isEmpty()) {
      return null; // 업로드할 파일이 없을 경우 null 반환
    }

    // 고유 파일 이름 생성
    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    String fileName = timestamp + "_" + file.getOriginalFilename();

    // 저장 경로 수정 (경로 중복 방지)
    File destination = new File(fileName);
    file.transferTo(destination);
    System.out.println(destination.getAbsolutePath());

    // 반환 경로
    return "/uploads/" + fileName;
  }
}
