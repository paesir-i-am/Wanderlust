package com.wanderlust.community.service;

/*
 * Description    :
 * ProjectName    : wanderlust
 * PackageName    : com.wanderlust.community.service
 * FileName       : FileService
 * Author         : paesir
 * Date           : 24. 12. 24.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 24. 12. 24.오후 12:00  paesir      최초 생성
 */

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class FileService {
  private final String uploadDir = "uploads/";

  public String saveFile(MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      return null;
    }

    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    String fileName = timestamp + "_" + file.getOriginalFilename();
    File destination = new File(uploadDir + fileName);
    file.transferTo(destination);

    return "/" + uploadDir + fileName; // URL 경로 반환
  }
}
