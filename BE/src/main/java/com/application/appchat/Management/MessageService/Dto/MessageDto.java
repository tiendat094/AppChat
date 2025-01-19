package com.application.appchat.Management.MessageService.Dto;

import com.application.appchat.Entity.Group;
import com.application.appchat.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private long id;
    private String content;
    private String userSender;
    private String groupName;
    private LocalDateTime createTime;
}
