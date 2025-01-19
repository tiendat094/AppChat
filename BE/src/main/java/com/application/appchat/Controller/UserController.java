package com.application.appchat.Controller;

import com.application.appchat.Entity.Group;
import com.application.appchat.Management.UserService.Dto.CreateUserDto;
import com.application.appchat.Management.UserService.Dto.LoginUserDto;
import com.application.appchat.Management.UserService.Dto.ResetPassword;
import com.application.appchat.Management.UserService.Dto.UserDto;
import com.application.appchat.Management.UserService.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private UserServices userServices;

    @PostMapping("/sighUp")
    public CreateUserDto sighUp(@RequestBody CreateUserDto createUserDto) {
        return userServices.SighUp(createUserDto);
    }

    @PostMapping("/login")
    public boolean login(@RequestBody LoginUserDto input) {
        boolean result = userServices.Login(input);
        if (result) {
            return true;
        }
        return false;
    }
    @PutMapping("/updateUser")
    public UserDto updateUser(@RequestBody UserDto userDto) {
        return userServices.UpdateUser(userDto);
    }

    @PutMapping("/resetPassword")
    public void resetPassword(@RequestParam String userName,@RequestParam String password) {
        userServices.ResetPassword(userName, password);
    }

    @GetMapping("/getAllUser")
    public List<UserDto> searchUser(@Nullable @RequestParam String search){
        return userServices.GetAllUser(search);
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam String userName) {
        userServices.DeleteUser(userName);
        return ResponseEntity.ok("Success Delete User with name " + userName);
    }

    @GetMapping("/getAllGroupForUser")
    public List<Group> getAllGroupUser(@RequestParam String userName) {
        return userServices.GetAllGroupForUser(userName);
    }

    @GetMapping("/getUserByName")
    public UserDto getUserByName(@RequestParam String userName) {
        return userServices.GetUserByName(userName);
    }

    @PostMapping("/updatePassword")
    public void updatePassword(@RequestBody ResetPassword rs){
        userServices.updatePassword(rs);
    }
}
