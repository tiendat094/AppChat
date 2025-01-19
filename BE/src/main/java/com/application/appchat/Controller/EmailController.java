package com.application.appchat.Controller;

import com.application.appchat.Management.EmailService.EmailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Controller
@RequestMapping("/email")
public class EmailController {
    Random random = new Random();
    @Autowired
    private EmailServices emailServices;
    private final static String subject = "Lấy Mã Otp Để Đặt Lại Mật Khẩu";
    private String body = Integer.toString(random.nextInt(9000)+1000);
    private Map<String, String> otpStorage = new HashMap<>();
    private void expireOtp(String email, long delayInMillis) {
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                otpStorage.remove(email);
            }
        }, delayInMillis);
    }
    @PostMapping("/sendmailOtp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        otpStorage.put(email, body);
        emailServices.sendEmail(email, subject, body);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<Boolean> verifyOtp(@RequestParam String email,@RequestParam String otp) {
        boolean isValid = false;
       if(otpStorage.containsKey(email)&&otpStorage.get(email).equals(otp)) {
           isValid = true;
           return ResponseEntity.ok(isValid);
       }
        return ResponseEntity.ok(isValid);
    }
}
