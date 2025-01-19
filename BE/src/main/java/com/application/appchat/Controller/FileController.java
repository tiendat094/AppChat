package com.application.appchat.Controller;

import com.application.appchat.Management.DropboxService.DropboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private DropboxService dropboxService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String dropboxPath = "/uploads/"+ LocalDateTime.now().format(formatter) + fileName;

            try (InputStream inputStream = file.getInputStream()) {
                // Sử dụng phương thức đã chỉnh sửa để nhận direct link
                String directLink = dropboxService.uploadFileAndGetDirectLink(dropboxPath, inputStream, file.getSize());

                // Trả về đối tượng JSON chứa URL direct link
                Map<String, String> response = new HashMap<>();
                response.put("url", directLink);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

}






