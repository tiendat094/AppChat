package com.application.appchat.Management.UserService;

import com.application.appchat.Entity.Group;
import com.application.appchat.Entity.User;
import com.application.appchat.Management.UserService.Dto.CreateUserDto;
import com.application.appchat.Management.UserService.Dto.LoginUserDto;
import com.application.appchat.Management.UserService.Dto.ResetPassword;
import com.application.appchat.Management.UserService.Dto.UserDto;
import com.application.appchat.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServices {
    @Autowired
    private UserRepository userRepo;

    @Transactional
    public CreateUserDto SighUp(CreateUserDto input) {
        User isCheck = userRepo.findByUserName(input.getUserName());
        if(isCheck !=null){
            throw new IllegalArgumentException("Đã tồn tại User với name : " + input.getUserName());
        }
        User user = new User();
      //  user.setId(input.getId());
        user.setUserName(input.getUserName());
        user.setPassword(input.getPassword());
        user.setEmail(input.getEmailAddress());
        user.setAvartarPath(input.getAvartarPath());
        user.setLastModifiedDate(LocalDateTime.now());
        user.setCreatedDate(LocalDateTime.now());
        userRepo.save(user);
        return input;
    }

    public boolean Login(LoginUserDto input) {
        User user = userRepo.findByUserName(input.getUsername());
        if(user == null){
            return false;
        }
        if(!user.getPassword().equals(input.getPassword())){
            return false;
        }
        return true;
    }

    public UserDto UpdateUser(UserDto input) {
        User user = userRepo.findByUserName(input.getUserName());
        if(user == null){
            throw new IllegalArgumentException("Không tồn tại User with Name : " + input.getUserName());
        }
        input.setId(user.getId());
        user.setUserName(input.getUserName());
        user.setEmail(input.getEmailAddress());
        user.setAvartarPath(input.getAvartarPath());
        user.setSex(input.getSex());
        userRepo.save(user);
        return input;
    }

    @Transactional
    public void ResetPassword(String userName, String passWord){
        User user = userRepo.findByUserName(userName);
        user.setPassword(passWord);
        userRepo.save(user);
    }


    public List<UserDto> GetAllUser(@Nullable String search){
        search = search == null ? "": search;
        var listUser =  userRepo.findBySearch(search);
        var listUserDto = new ArrayList<UserDto>();
        for (User user : listUser) {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUserName(user.getUserName());
            userDto.setAvartarPath(user.getAvartarPath());
            userDto.setEmailAddress(user.getEmail());
            userDto.setSex(user.getSex());
            userDto.setStatus(userDto.getStatus());
            listUserDto.add(userDto);
        }
       return listUserDto;
    }

    public void DeleteUser(String userName){
        User user = userRepo.findByUserName(userName);
        userRepo.delete(user);
    }

    public List<Group> GetAllGroupForUser(String userName){
        User user = userRepo.findByUserName(userName);
        return userRepo.getGroupsForUser(user.getId());
    }
    public UserDto GetUserByName(String userName){
        User user = userRepo.findByUserName(userName);
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUserName(user.getUserName());
        userDto.setAvartarPath(user.getAvartarPath());
        userDto.setEmailAddress(user.getEmail());
        userDto.setSex(user.getSex());
        userDto.setStatus(userDto.getStatus());
        return userDto;
    }
    public List<UserDto> searchUser(String search){
        var listUser=   userRepo.findBySearch(search);
        var listUserDto = new ArrayList<UserDto>();
        for (User user : listUser) {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUserName(user.getUserName());
            userDto.setAvartarPath(user.getAvartarPath());
            userDto.setEmailAddress(user.getEmail());
            userDto.setStatus(userDto.getStatus());
            listUserDto.add(userDto);

        }
        return listUserDto;
    }
    public void updatePassword(ResetPassword rs){
        User user = userRepo.findByEmail(rs.getEmail());
        user.setPassword(rs.getPassword());
        userRepo.save(user);
    }
}
