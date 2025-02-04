package com.application.appchat.Management.MessageService.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {
    private String type;
    private String sender;
    private String receiver;
    private String sdp;
    private String candidate;


}
