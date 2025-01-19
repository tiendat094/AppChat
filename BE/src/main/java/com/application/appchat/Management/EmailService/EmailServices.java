package com.application.appchat.Management.EmailService;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {
    @Autowired
    private JavaMailSender emailSender;


    public void sendEmail(String toEmail,String subject,String body){
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper help = new MimeMessageHelper(message);
            help.setFrom("datd15287@gmail.com");
            help.setTo(toEmail);
            help.setSubject(subject);
            help.setText(body);
            emailSender.send(message);
        }catch(Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
