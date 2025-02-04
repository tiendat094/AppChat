package com.application.appchat.Controller;
import com.application.appchat.Management.MessageService.Dto.MessageDto;
import com.application.appchat.Management.MessageService.MessageServices;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private MessageServices messageServices;
    public ChatController(SimpMessagingTemplate messagingTemplate
    ,MessageServices messageServices) {
        this.messagingTemplate = messagingTemplate;
        this.messageServices = messageServices;
    }
    @MessageMapping("/chat")
    public void sendMessage(MessageDto message) {
        messageServices.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/messages/"+message.getGroupName(), message);
    }

}




































































