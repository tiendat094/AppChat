package com.application.appchat.Management.MessageService;

import com.application.appchat.Entity.Message;
import com.application.appchat.Management.MessageService.Dto.MessageDto;
import com.application.appchat.Repository.GroupRepository;
import com.application.appchat.Repository.MessageRepository;
import com.application.appchat.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.ResourceTransactionManager;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MessageServices {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupRepository groupRepository;

    public void saveMessage(MessageDto mesageDto){
        Message message = new Message();
        var user = userRepository.findByUserName(mesageDto.getUserSender());
        var group = groupRepository.findByNameGroup(mesageDto.getGroupName());
        message.setUser(user);
        message.setGroup(group);
        message.setContent(mesageDto.getContent());
        message.setCreatedDate(LocalDateTime.now());
        String lsMessage = "";
        if( message.getContent().contains("png")){
             lsMessage = user.getUserName()+": Đã gửi một ảnh !";
        }else if( message.getContent().contains("txt")){
            lsMessage = user.getUserName()+": Đã gửi một File !";
        }
        else {
            lsMessage = user.getUserName() + ": " + mesageDto.getContent();
        }
        group.setLastMessage(lsMessage);
        group.setLastMessageDate(LocalDateTime.now());
        groupRepository.saveAndFlush(group);
        messageRepository.save(message);
    }

    public String editMessage(long messageId, String newContent){
        var message = messageRepository.findById(messageId);
        if(message == null){
            throw new NoSuchElementException("Không tồn tịa message");
        }
        message.setContent(newContent);
        messageRepository.save(message);
        return newContent;
        }

    public void deleteMessage(long messsageId){
        var message = messageRepository.findById(messsageId);
        messageRepository.delete(message);
    }

    public List<MessageDto> getMessageInGroup(String nameGroup){
          var group = groupRepository.findByNameGroup(nameGroup);
          var listMessage =  messageRepository.findByGroup_Id(group.getId());
          var messageDtos = new ArrayList<MessageDto>();
          for(Message message : listMessage){
              MessageDto messageDto = new MessageDto();
              messageDto.setId(message.getId());
              messageDto.setContent(message.getContent());
              messageDto.setUserSender(message.getUser().getUserName());
              messageDto.setGroupName(nameGroup);
              messageDto.setCreateTime((LocalDateTime) message.getCreatedDate());
              messageDtos.add(messageDto);
          }
          return messageDtos;
    }

    public List<MessageDto> searchMessage(String search, long groupId){
        var listMessage = messageRepository.searchMessage(search,groupId);
        var messageDtos = new ArrayList<MessageDto>();
        for(Message message : listMessage){
            MessageDto messageDto = new MessageDto();
            messageDto.setId(message.getId());
            messageDto.setContent(message.getContent());
            messageDto.setUserSender(message.getUser().getUserName());
            messageDto.setCreateTime(message.getCreatedDate());
            messageDtos.add(messageDto);
        }
        return messageDtos;
    }
}
