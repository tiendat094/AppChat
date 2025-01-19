package com.application.appchat.Management.GroupService;

import com.application.appchat.Config.AppChatEnum;
import com.application.appchat.Entity.Group;
import com.application.appchat.Entity.User;
import com.application.appchat.Management.GroupService.Dto.AddUserInGroup;
import com.application.appchat.Management.GroupService.Dto.GroupDto;
import com.application.appchat.Management.MessageService.Dto.MessageDto;
import com.application.appchat.Management.MessageService.MessageServices;
import com.application.appchat.Management.UserService.Dto.UserDto;
import com.application.appchat.Management.UserService.UserServices;
import com.application.appchat.Repository.GroupRepository;
import com.application.appchat.Repository.UserRepository;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class GroupServices {
    @Autowired
    private GroupRepository groupRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private MessageServices messageServices;
    @Autowired
    private UserServices userServices;

    public List<GroupDto> getAllGroups() {
        List<Group> groups = groupRepo.findAll();
        return groups.stream()
                .map(group -> new GroupDto(group.getId(), group.getNameGroup(),"",group.getAvartarPath(),group.getGroupType(),group.getLastMessage(),group.getLastMessageDate()))
                .collect(Collectors.toList());
    }

    public GroupDto CreateGroup(GroupDto groupDto) {

        Group group = groupRepo.findByNameGroup(groupDto.getNameGroup());
        if (group != null) {
            throw new IllegalArgumentException("Đã tồn tại group with Name " + groupDto.getNameGroup());
        }

        User user = userRepo.findByUserName(groupDto.getUserName());
        if (user == null) {
            throw new IllegalArgumentException("User không tồn tại");
        }

        Group newGroup = new Group();
        newGroup.setId(groupDto.getId());
        newGroup.setNameGroup(groupDto.getNameGroup());
        newGroup.setAvartarPath(groupDto.getAvartarPath());
        newGroup.setCreatedDate(LocalDateTime.now());
        newGroup.setLastModifiedDate(LocalDateTime.now());
        newGroup.setGroupType(AppChatEnum.GroupType.PUBLIC);
        groupRepo.save(newGroup);

        user.getGroups().add(newGroup);
        var roleGroup = user.getRoleGroup();
        roleGroup.add(groupDto.getNameGroup());
        userRepo.save(user);

        return groupDto;
    }

    public Group AddFriend(String userCurrent,String userFriend) {
         User user = userRepo.findByUserName(userCurrent);
         User friend = userRepo.findByUserName(userFriend);
         Group group = new Group();
         group.setNameGroup(user.getUserName()+"_"+friend.getUserName());
         group.setGroupType((AppChatEnum.GroupType.PRIVATE));
         group.setCreatedDate(LocalDateTime.now());
         group.setLastModifiedDate(LocalDateTime.now());
         groupRepo.save(group);
         user.getGroups().add(group);
         friend.getGroups().add(group);
         userRepo.save(user);
         userRepo.save(friend);
         return group;

    }


    public void AddUserToGroup(AddUserInGroup input) {
        var isCheckAutho = userRepo.findByUserName(input.getUserName());
        Group group = groupRepo.findById(input.getGroupId());
//        if(!isCheckAutho.getRoleGroup().contains(group.getNameGroup())) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this resource.");
//        }

        var user = userRepo.findByUserName(input.getUserName());
        user.getGroups().add(group); //remove Group trong User
        userRepo.save(user);
    }

    public void RemoveUserToGroup(long groupId, String newUserName ) {
//        var isCheckAutho = userRepo.findByUserName(newUserName);
//        if (!isCheckAutho.getRoleGroup().contains(groupDto.getNameGroup())) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this resource.");
//        }
        Group group = groupRepo.findById(groupId);
        var user = userRepo.findByUserName(newUserName);
        var listUserInGroup = group.getUsers().stream().map(User::getUserName).collect(Collectors.toList());
        var isCheckUser = listUserInGroup.contains(user.getUserName());
        if (!isCheckUser) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User không tồn tại trong group");
        }
        user.getGroups().remove(group);
        userRepo.save(user);
    }

   public void RemoveUserFromGroup(long groupId) {
         Group group = groupRepo.findById(groupId);
         var listUser = group.getUsers();
         for (User user : listUser) {
             userServices.DeleteUser(user.getUserName());
         }
   }
    public void RemoveGroup(long groupId) {
        Group group = groupRepo.findById(groupId);
//        var isCheckAutho = userRepo.findByUserName(group.getUserName());
//        if (!isCheckAutho.getRoleGroup().contains(group.getNameGroup())) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this resource.");
//        }
        var listMessage = messageServices.getMessageInGroup(group.getNameGroup());
        for (MessageDto message : listMessage) {
            messageServices.deleteMessage(message.getId());
        }
        var listUser = group.getUsers();
        for (User user : listUser) {
            RemoveUserToGroup(groupId, user.getUserName());
        }

        groupRepo.delete(group);
    }


    public List<Group> searchGroupByName(String nameGroup) {
        List<Group> listGroup = groupRepo.findBySearchNameGroup(nameGroup);
        return listGroup;
    }

    public List<UserDto> listUserByGroupId(long groupId) {
        List<User> listUser = groupRepo.getUserForGroup(groupId);
        List<UserDto> users = new ArrayList<>();
        for (User user : listUser) {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUserName(user.getUserName());
            userDto.setEmailAddress(user.getEmail());
            userDto.setAvartarPath(user.getAvartarPath());

            users.add(userDto);
        }
        return users;
    }

    public Group getFriend(String name1 , String name2) {
        return groupRepo.findByFriend(name1,name2);
    }

    public void outGroup(long groupId,String userName) {
        Group group = groupRepo.findById(groupId);
        User user = userRepo.findByUserName(userName);
        group.getUsers().remove(user);
        user.getGroups().remove(group);
        userRepo.save(user);
        groupRepo.save(group);
    }
}
