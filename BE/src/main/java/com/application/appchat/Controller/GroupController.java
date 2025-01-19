package com.application.appchat.Controller;

import com.application.appchat.Entity.Group;
import com.application.appchat.Management.GroupService.Dto.AddUserInGroup;
import com.application.appchat.Management.GroupService.Dto.GroupDto;
import com.application.appchat.Management.GroupService.GroupServices;
import com.application.appchat.Management.UserService.Dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.transform.Result;
import java.util.List;

@RestController
@RequestMapping("/group")
public class GroupController {
    @Autowired
    private GroupServices groupServices;


    @GetMapping("/getAll")
    public ResponseEntity<List<GroupDto>> getAll() {

        return new ResponseEntity<>(groupServices.getAllGroups(),HttpStatus.OK);
    }
    @PostMapping("/createGroup")
    public ResponseEntity<GroupDto> createGroup(@RequestBody GroupDto group) {
        var rs = groupServices.CreateGroup(group);
        return new ResponseEntity<>(rs, HttpStatus.OK);
    }
    @PostMapping("/addFriend")
    public ResponseEntity<Group> addFriend(@RequestParam String userCurrent, @RequestParam String userFriend) {
        var rs = groupServices.AddFriend(userCurrent, userFriend);
        return new ResponseEntity<>(rs, HttpStatus.OK);
    }
    @PostMapping("/addUserInGroup")
    public void addGroup(@RequestBody AddUserInGroup input) {
        groupServices.AddUserToGroup(input);
    }


    @DeleteMapping("/deleteUserToGroup")
    public ResponseEntity<String> delete(@RequestParam long groupId, @RequestParam String newUser) {
        groupServices.RemoveUserToGroup(groupId, newUser);
        return new ResponseEntity<>("Remove User with Name " + newUser +" success !",HttpStatus.OK);
    }

    @DeleteMapping("/deleteGroup")
    public ResponseEntity<String> delete(@RequestParam long groupId) {
        groupServices.RemoveGroup(groupId);
        return new ResponseEntity<>("Remove Group Success !",HttpStatus.OK);
    }

    @GetMapping("/searchGroup")
    public ResponseEntity<List<Group>> searchGroup(@RequestParam String groupName) {
        var listGroup = groupServices.searchGroupByName(groupName);
        return new ResponseEntity<>(listGroup,HttpStatus.OK);
    }

    @GetMapping("/getUserForGroup")
    public ResponseEntity<List<UserDto>> getUserForGroup(@RequestParam long groupId) {
        var listUser = groupServices.listUserByGroupId(groupId);
        return new ResponseEntity<>(listUser,HttpStatus.OK);
    }

    @GetMapping("/getFriend")
    public ResponseEntity<Group> getFriend(@RequestParam String name1, @RequestParam String name2  ) {
        var group = groupServices.getFriend(name1, name2);
        return new ResponseEntity<>(group,HttpStatus.OK);
    }

    @DeleteMapping("/outGroup")
    public void outGroup(@RequestParam long groupId,@RequestParam String username) {
        groupServices.outGroup(groupId,username);
    }
}
