package com.application.appchat.Controller;

import com.application.appchat.Management.MessageService.Dto.MessageDto;
import com.application.appchat.Management.MessageService.Dto.SignalMessage;
import com.application.appchat.Management.MessageService.MessageServices;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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
    //@SendTo("/topic/messages")
    public void sendMessage(MessageDto message) {
        messageServices.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/messages/"+message.getGroupName(), message);
    }


    @MessageMapping("/signal")
    @SendTo("/topic/signal")
    public SignalMessage handleSignaling(SignalMessage signalMessage) {
        // Có thể thêm logic xử lý nếu cần
        return signalMessage;
    }

}




































































