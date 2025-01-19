package com.application.appchat.Controller;

import com.application.appchat.Management.MessageService.Dto.MessageDto;
import com.application.appchat.Management.MessageService.MessageServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageServices messageServices;
    @PostMapping("/saveMessage")
    public ResponseEntity<String> save(@RequestBody MessageDto input) {
          messageServices.saveMessage(input);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/editMessage")
    public ResponseEntity<String> edit(@RequestParam long messageId , @RequestParam String newMessage) {
         var rs = messageServices.editMessage(messageId, newMessage);
        return new ResponseEntity<>(rs,HttpStatus.OK);
    }
    @DeleteMapping("/deleteMessage")
    public ResponseEntity<String> delete(@RequestParam long messageId) {
        messageServices.deleteMessage(messageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/messageInGroup")
    public ResponseEntity<List<MessageDto>> messageInGroup(@RequestParam String nameGroup) {
        var rs = messageServices.getMessageInGroup(nameGroup);
        return new ResponseEntity<>(rs,HttpStatus.OK);
    }

    @GetMapping("/searchMessage")
    public ResponseEntity<List<MessageDto>> searchMessage(@RequestParam String searchMessage, @RequestParam long groupId){
        var rs = messageServices.searchMessage(searchMessage, groupId);
        return new ResponseEntity<>(rs, HttpStatus.OK);
    }
}
