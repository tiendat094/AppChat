package com.application.appchat.Management.GroupService.Dto;

import com.application.appchat.Config.AppChatEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupDto {
    private long id;
    private String nameGroup;
    private String userName;
    private String avartarPath;
    private AppChatEnum.GroupType groupType;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
}
