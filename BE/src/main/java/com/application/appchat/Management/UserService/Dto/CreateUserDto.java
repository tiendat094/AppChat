package com.application.appchat.Management.UserService.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDto {
    private long id;
    private String userName;
    private String emailAddress;
    private String password;
    private String avartarPath;
}
