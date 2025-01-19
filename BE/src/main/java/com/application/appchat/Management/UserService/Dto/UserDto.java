package com.application.appchat.Management.UserService.Dto;

import com.application.appchat.Config.AppChatEnum;
import com.application.appchat.Entity.Group;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private long Id;
    private String UserName;
    private AppChatEnum.Status Status;
    private AppChatEnum.Sex Sex ;
    private String AvartarPath;
    private String EmailAddress;
    private Set<Group> Groups;


}
