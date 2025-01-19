import { AddUserInGroup } from './service/model/group.dto';
import { MessageService } from './service/api/messageService';
import { GroupService } from './service/api/groupService';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketService } from './service/api/webSocket';
import { CommonModule } from '@angular/common';
import SockJS from 'sockjs-client';
import { Frame, Message, Client } from '@stomp/stompjs';
import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { Location } from '@angular/common'; // Để sử dụng location.state
import { UserService } from './service/api/userService';
import { GroupDto, UserDto } from './service/model/user.dto';
import { MessageDto } from './service/model/message.dto';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { GroupComponent } from './group.component';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from './user.component';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  standalone: true,
  providers: [UserService, MessageService, GroupService, CallService,FileService],
  imports: [FormsModule, CommonModule, HttpClientModule, MatInputModule, MatIconModule,],
  template: `
    <div class="container">
    <div class="sidebar">
        <div class="search-bar">
        <img [src]="userAvartarMap.get(username)"  alt="Search Icon" class="search-icon" (click)="toggleCategorySidebar()">

        <div *ngIf="isCategorySidebarOpen" class="dropdown-menu">
  <div>
    <span>⚙️</span> <p>Setting</p>
  </div>
  <div (click)="updateInfoUserDialog()">
    <span>📋</span> <p>Thông tin cá nhân</p>
  </div>
  <div (click)="openGroupForm()">
    <span>➕</span> <p>Create Group</p>
  </div>
  <button (click)="logOut()">
    <span>&#x21A9;</span> <p>Log Out</p>
  </button>
</div>


        <input type="text" #searchInput placeholder="Search..."  
                   (keyup.enter)="getGroupByName(searchInput.value)">
        </div>
        <div class="search-results">
        <div *ngFor="let group of listGroupForUser" 
     style="display: flex; align-items: flex-start; margin-bottom: 16px; padding: 12px 16px; border-radius: 8px; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease, box-shadow 0.3s ease; cursor: pointer;" 
     (click)="showMessageInGroup(group)"
     [ngStyle]="{ 'background-color': nameGroupCurrent === group.nameGroup ? '#e0f7fa' : '#fff' }" 
     >
     
    <img 
        *ngIf="isPrivateGroup(group)" 
        [src]="getAvatarPath(group)" 
        alt="User Avatar" 
        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 12px;"
    >
    <img 
        *ngIf="isPublicGroup(group)" 
        [src]="group.avartarPath || 'https://example.com/default-avatar.png'" 
        alt="Group Avatar" 
        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 12px;"
    >

    <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-weight: bold; font-size: 14px; color: #333; line-height: 1.2;">
                {{ isPrivateGroup(group) ? getUserName(group) : group.nameGroup }}
            </div>
            
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #555; line-height: 1.5; word-wrap: break-word; width: 100%;">
  <span style="flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; ">
    {{ group.lastMessage }}
  </span>
  
  <div style="font-size: 12px; color: gray; white-space: nowrap; margin-left: 12px; flex-shrink: 0; width: 100px; text-align: right;">
    {{ group.lastMessageDate | date: 'short' }}
  </div>
</div>     
    </div>
</div>

</div>
</div>
    <div class="chat">
        <div class="chat-header">
            <div class="user-info">           
                <img [src]="linkAvartarGroupCurrent ? linkAvartarGroupCurrent : 'https://cdn.mezon.vn/1779484504377790464/1833341515963830272/1831544914039541800/273_undefinedScreenshot_2024_11_09_224436.png'" alt="Sharon Lessman">
                <strong class="group-name">{{nameGroupCurrent}}</strong>
            </div>
            <div class="actions">
                <button>📞</button>
                <button (click)="call()">🎥</button>
                <button (click)="toggleSidebar()">⋮</button>   
        <div class="expand-sidebar" [ngClass]="{'active': isSidebarVisible}">
            <div class="expand-header">
                
                <h3>Cài đặt đoạn chat</h3>
                <button (click)="toggleSidebar()">✖</button>
            </div>
            <div class="expand-content">
              <img class="avatar" [src]="linkAvartarGroupCurrent"  alt="Avatar" />
                <button (click)="getInfoGroup()">📋 Thông tin về đoạn chat</button>
                <button (click)="editGroup()">⚙️ Tùy chỉnh trong đoạn chat</button>              
                <button (click)="getUserInGroup(groupIdCurrent)">👥 Thành viên trong đoạn chat</button>
                <div style="max-height: 300px; overflow-y: auto;">
  <div
    *ngIf="isExpandListUser"
    #scrollContainer
    class="user-list"
    style="max-height: 300px; "
  >
    <div *ngFor="let user of listUserForGroup" class="user-item">
      <img [src]="user.avartarPath" alt="{{ user.userName }}" class="avatar" (click)="redirectToUser(user.userName)"/>
      <span class="user-name">{{ user.userName }}</span>
    </div>
    <div #lastItem>
    <div class="add-user" (click)="toggleAddUser()" style="cursor: pointer;">
      ➕ Thêm người dùng
    </div>
    <div *ngIf="isAddingUser" class="add-user-form">
  <label for="userName">Tên người dùng</label>
  <input 
    id="userName" 
    type="text" 
    [(ngModel)]="newUserName" 
    placeholder="Nhập tên người dùng" 
    class="user-input" 
  />
  <button (click)="addUserInGroup()" class="add-button">Thêm</button>
</div>
    </div>
  </div>
</div>
                <button (click)="isToggleSearch()">🔍 Tìm kiếm tin nhắn</button>
                <div *ngIf="isSearchMessage" class="search-container" style="display: flex; align-items: center; position: relative; width: 100%;">
  <mat-form-field appearance="fill" style="flex-grow: 1;">
    <mat-label>Tìm kiếm tin nhắn</mat-label>
    <input matInput [(ngModel)]="searchMessage" placeholder="Nhập tin nhắn" >
    <button mat-raised-button 
            (click)="searchMessageInGroup()" 
            aria-label="Search" 
            style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 50px; height: 100%; padding: 0;">
      <mat-icon>search</mat-icon>
    </button>
  </mat-form-field>
</div>

<div *ngIf="listMessageSearch.length > 0" class="search-results">
  <div *ngFor="let message of listMessageSearch" class="message-item" style="display: flex; align-items: flex-start; margin-bottom: 16px;">
    <img 
      [src]="userAvartarMap.get(message.userSender)" 
      alt="Avatar" 
      class="avatar" 
      style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 10px;">
    <div class="message-body" style="flex: 1;">
      <div class="message-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div class="sender-name" style="font-weight: bold;">{{ message.userSender }}</div>
        <div class="message-time" style="font-size: 12px; color: gray;">{{ message.createTime | date: 'short' }}</div>
      </div>
      <div class="message-content" style="font-size: 14px;">{{ message.content }}</div>
    </div>
  </div>
</div>
<button (click)="outGroup()">&#x21A9; Out Group</button>
            </div>
        </div>       
            </div>
        </div>
        
      

        <div class="chat-messages" #messagesContainer>
  <div
    class="message"
    *ngFor="let msg of messages"
    [ngClass]="{'sent': msg.userSender === username, 'received': msg.userSender !== username, 'none': msg.userSender == null}"
    (mouseenter)="onMessageHover(msg)"
    (mouseleave)="onMessageLeave(msg)"
  >
    <div class="avatar">
      <img [src]="userAvartarMap.get(msg.userSender)" (click)="redirectToUser(msg.userSender)" alt="avatar">
    </div>
    <div class="content">
      <div class="header">
        <div class="sender" *ngIf="username !== msg.userSender">{{ msg.userSender }}</div>
        <div class="time">{{ msg.createTime | date: 'short' }}</div>
      </div>
      <div class="text">
        <div class="message-image-container" *ngIf="isImageUrl(msg.content); else checkFileContent">
          <img [src]="msg.content" alt="message image" class="message-image">
        </div>
        
        <ng-template #checkFileContent>
          <div *ngIf="isFileUrl(msg.content); else textContent">
            <div class="message-file-container">
              <div class="file-info">
                <span class="file-name">{{ msg.content.split('/').pop() }}</span>
                <button class="download-button" (click)="downloadFile(msg.content)">
                  <i class="pi pi-download"></i> Download
                </button>
              </div>
            </div>
          </div>
        </ng-template>

        <ng-template #textContent>
          {{ msg.content }}
        </ng-template>
      </div>
      
      <div class="options-button" *ngIf="isHovered">
        <button class="menu-button" (click)="toggleOptionsMenu()">⋮</button>
        <div class="options-menu" *ngIf="showMenu">
          <button (click)="prepareEditMessage(msg)">Edit</button>
          <button (click)="deleteMessage(msg)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>




    <div class="chat-footer">
        <input
    type="text"
    [(ngModel)]="message" 
    placeholder="Type a message..."
    (keyup.enter)="editMessage(idMessageUpdate,message)"
  />
  <label for="file-upload" class="upload-icon">
  📤 
  </label>
  <input id="file-upload" type="file" (change)="onFileChange($event)" hidden />
  <button type="submit" class="chat-footer-button" (click)="sendMessage('/app/chat', messages)"
                                
  >Send </button>
    </div>
    </div>
</div>
  `,
  styles: [`
    body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e9ecef, #dee2e6);
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1400px;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    overflow: hidden;
    height: 90vh; 
}
.sidebar { 
  position: relative;
  flex: 0 0 30%;
  border-right: 1px solid #e0e0e0;
  background-color: #f7f8fa;
  padding: 20px;
  overflow-y: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.search-bar .dropdown-menu {
    position: absolute;
    top: 60px;
    left: 50px;
    width: 240px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    padding: 12px 0;
    animation: fadeIn 0.3s ease-in-out;
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.search-bar .dropdown-menu div,
.search-bar .dropdown-menu button {
    display: flex;
    align-items: center;
    gap: 12px; /* Khoảng cách giữa icon và text */
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    background: none;
    border: none;
    text-align: left;
    transition: background-color 0.3s, color 0.3s;
    width: 100%;
}

.search-bar .dropdown-menu div:hover,
.search-bar .dropdown-menu button:hover {
    background-color: #f9f9f9;
    color: #007bff;
}

.search-bar .dropdown-menu p {
    margin: 0;
}

.search-bar .dropdown-menu span {
    font-size: 18px; /* Kích thước icon */
    display: flex;
    align-items: center;
}

.search-bar .dropdown-menu button {
    border: none;
    background: none;
    font-size: 14px;
    text-align: left;
}

.sidebar .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.sidebar .search-bar .search-icon {
    width: 50px; 
    height: 50px;
    margin-right: 10px;
    border-radius: 50%;
}

.sidebar .search-bar input {
    flex: 1; 
    width: auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    transition: all 0.3s ease-in-out;
}

.sidebar .search-bar input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}
.sidebar .contact-list a {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 8px;
    color: #333;
    text-decoration: none;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
}

.sidebar .contact-list a:hover {
    background-color: #d7efff;
}

.sidebar .contact-list img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.sidebar .contact-list .contact-info strong {
    font-size: 14px;
}

.sidebar .contact-list .contact-info .status {
    font-size: 12px;
    color: #777;
}

.chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
}

.chat-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
}

.chat-header .user-info {
    display: flex;
    align-items: center;
}

.chat-header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}
.group-name {
  font-size: 20px; 
  font-weight: bold; 
  justify-content: center;
}
.chat-header .user-info strong {
    font-size: 20px;
    color: #007bff;
}

.chat-header .actions button {
    background-color: transparent;
    border: none;
    margin-left: 10px;
    font-size: 18px;
    cursor: pointer;
    color: #007bff;
    transition: color 0.3s;
}

.chat-header .actions button:hover {
    color: #0056b3;
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto; 
    scroll-behavior: smooth; 
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    max-height: 810px; 
}

.chat-messages .message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    justify-content: flex-start;
}

.chat-messages .message .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.chat-messages .message .content {
  display: inline-block;
    max-width: 100%; 
    min-width: 150px; 
    margin-left: 10px; 
    word-wrap: break-word; 
    padding: 10px 15px;
    background-color:white;
    color: #fff;
    border-radius: 12px;
    text-align: left;
}

.chat-messages .message .text {
    background-color: #007bff;
    color: #fff;
    margin-left:1px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    position: relative;
    width:auto;
    height: autopx;
    min-width: 100%; 
}

.chat-messages .message .text:after {
    content: "";
    position: absolute;
    top: 10px;
    left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent #007bff transparent transparent;
}

.chat-messages .message .text .time {
    font-size: 12px;
    color: #ddd;
    margin-top: 5px;
    text-align: right;
}

.chat-footer {
    padding: 15px 20px;
    background-color: #f7f8fa;
    border-top: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
}

.chat-footer input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.chat-footer input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.chat-footer button {
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, transform 0.2s;
    pointer-events: auto;  
}


.chat-footer button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.contact-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.3s;
}

.contact-item:hover {
    background-color: #f5f5f5;
}

.user-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
}

.user-link img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.contact-info {
    flex: 1;
}

.username {
    display: block;
    font-size: 16px;
    color: #333;
}

.user-email {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
}

.status-indicator {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
}

.status-indicator.online {
    color: #28a745;
}
.list-group-item {
    border: none; /* Loại bỏ viền */
    background-color: #fff; /* Nền trắng */
}

.rounded-circle {
    border: 1px solid #ddd; /* Viền nhẹ quanh avatar */
}

.small.text-muted {
    font-size: 12px;
    color: #6c757d; 
}

.badge {
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 12px; 
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.avatar {
  width: 60px; /* Avatar lớn hơn */
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sender {
  font-weight: bold;
  font-size: 14px;
}

.time {
  margin-left:2px;
  font-size: 12px;
  color: gray;
}

.text {
  background-color: #e9ecef;
  border-radius: 12px;
  padding: 8px 12px;
  margin-top: 5px; 
  word-break: break-word;
  max-width: 70%; 
}

.message {
  display: flex;
  position: relative; 
  align-items: center; 
}

.message.sent {
  flex-direction: row-reverse; 
}
 .message.none{
  flex-direction: row;
 }
.message.received {
  flex-direction: row; 
}

.content {
  position: relative; 
  max-width: 70%; 
}

.options-button {
  position: absolute;
  top: 10px; 
  right: -40px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0; 
  transition: opacity 0.2s;
}

.message:hover .options-button {
  opacity: 1;
}

.options-menu {

  position: absolute;
  top: 40px; 
  right: -40px; 
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  border-radius: 4px;
  overflow: hidden;
}

.options-menu button {
  width: 100%;
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
}

.options-menu button:hover {
  background-color: #f0f0f0;
}
.message.received .options-button {
  right: -40px;
  left: auto;
}

.message.sent .options-button {
  text-align: center;
}
.message.sent .options-button {
  left: -40px; 
  right: auto;
}
.options-button:focus + .options-menu,
.options-menu:focus-within {
  display: block; 
}


.expand-sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 0; 
    height: 100vh;
    background-color: #fff;
    border-left: 1px solid #ddd;
    box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.2);
    overflow: auto; 
    transition: width 0.3s ease; 
    z-index: 1000;
}

.expand-sidebar.active {
    width: 400px; 
}


.expand-header {
    display: flex;
    justify-content: space-between;  
    align-items: center;            
    padding:  19px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    position: relative;              
}


.expand-header h3 {
    margin: 0;
    font-size: 18px;
    text-align: center;            
    flex-grow: 1;                   
}


.expand-header button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
}

/* Nội dung sidebar */
.expand-content {
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;  /* Căn giữa nội dung trong sidebar */
    justify-content: center;
}

.expand-content .avatar {
    width: 120px;            /* Kích thước lớn của avatar */
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;     /* Khoảng cách giữa avatar và các nút */
}

.expand-content button {
    background: none;
    border: none;
    text-align: left;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;             /* Đảm bảo các nút chiếm hết chiều rộng của sidebar */
}

.expand-content button:hover {
    background-color: #f0f0f0;
}

.user-list {

  padding: 5px;
  border-radius: 5px;
  max-height: 300px; 

}

.user-item {
  display: flex;
  align-items: center; 
  padding: 5px 8px;
  border-bottom: 1px solid #eee; 
  
}



.user-item .avatar {
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  margin-right: 8px; 
}

.user-item .user-name {
  font-size: 16px;
  color: #333;
}

.add-user-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-user-form label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.user-input:focus {
  border-color: #007bff;
  outline: none;
}

.user-input .add-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-input.add-button:hover {
  background-color: #0056b3;
}
.message-image {
  display: block; /* Đảm bảo ảnh là block */
  max-width: 100%; /* Chiếm hết không gian cho phép */
  height: 200px; /* Giữ tỉ lệ ảnh */
  object-fit: cover; /* Đảm bảo full kích thước */
  border-radius: 0; /* Xóa border tròn nếu có */
}

.message-image-container {
  width:300px; /* Cho phép container mở rộng */
  max-width: 100%; /* Giới hạn khung */
  height: 200px; /* Tự động điều chỉnh chiều cao */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent; /* Không có màu nền */
  border: none;
  padding: 0; /* Xóa padding nếu có */
}
.message-file-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 8px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.message-file-container:hover {
  background-color: #e0e0e0;
}

.file-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.file-preview-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.file-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.file-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.download-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.download-button:hover {
  background-color: #0056b3;
}

.download-button i {
  margin-right: 5px;
}

.message-file-container:hover .download-button {
  background-color: #0056b3;
}



  `],

})
export class ChatComponent {
  message = '';
  public linkImage: string = ''
  public username: string = " ";
  public groupName: string = "";
  public nameGroupCurrent = " ";
  public searchNameGroup = "";
  public groupIdCurrent!: number;
  public linkAvartarGroupCurrent = "";
  public messages: MessageDto[] = [];
  public listGroupForUser: GroupDto[] = [];
  public listUser: UserDto[] = [];
  public userCurrent?: UserDto;
  public isHovered: boolean = false;
  public showMenu: boolean = false;
  public idMessageUpdate: any;
  public isExplainCate: boolean = false;
  public listMessageSearch: MessageDto[] = [];
  uploadFile: File | null = null;
  isSearchMessage = false;
  userAvartarMap = new Map<string, string>();
  isSidebarVisible: boolean = false;
  isUserListVisible = false;
  listUserForGroup: UserDto[] = []
  isExpandListUser = false;
  isAddingUser = false;
  newUserName = '';
  searchMessage = ''
  isCategorySidebarOpen = false;
  constructor(private groupService: GroupService,
    private userService: UserService, private messageService: MessageService, private callService: CallService,private fileService : FileService,
    private router: Router, private dialog: MatDialog) {

  }
  @ViewChild('messagesContainer') messagesContainer!: ElementRef; // Ensure this is declared in your class
  @ViewChild('lastItem') lastItem!: ElementRef; // Tham chiếu tới phần tử cuối
  @ViewChild('scrollContainer') scrollContainer!: ElementRef; // Tham chiếu tới container
  onMessageHover(msg: any) {
    if (msg.userSender == this.username) {
      this.isHovered = true;
    }

  }

  // Ẩn button khi rời chuột khỏi tin nhắn
  onMessageLeave(msg: any) {
    this.isHovered = false;
    this.showMenu = false; // Ẩn menu chức năng
  }

  // Toggle menu chức năng
  toggleOptionsMenu() {
    this.showMenu = !this.showMenu;

  }
  prepareEditMessage(msg?: any) {
    this.message = msg.content;
    this.idMessageUpdate = msg.id;
  }
  // Xử lý sửa tin nhắn
  editMessage(messageId: number, newContent: string) {
    this.messageService.editMessage(messageId, newContent).subscribe({
      next: () => {
        const message = this.messages.find(msg => msg.id == messageId);
        if (message) {
          message.content = newContent;
          this.message = '';
        }
      }
    })


  }

  deleteMessage(msg: any) {
    this.messageService.removeMessage(msg.id).subscribe({
      next: () => {
        this.messages = this.messages.filter((m) => m !== msg);
      },
      error: (err) => {
        console.error('Lỗi khi xóa tin nhắn:', err);
      },
    });
  }
  ngOnInit() {
    this.username = history.state.username;
    this.connect();
    this.userService.getAllGroupForUser(this.username).subscribe((group: GroupDto[]) => {
      this.listGroupForUser = group;

    });

    this.userService.getUserByName(this.username).subscribe(rs => {
      this.userCurrent = rs;
    })
    this.messageService.getAllMessageInGroup(this.groupName).subscribe((messages: MessageDto[]) => {
      this.messages = messages;
    });
    this.userService.getAllUser().subscribe((user: UserDto[]) => {
      user.forEach(u => {
        if (u.userName && u.avartarPath) {
          this.userAvartarMap.set(u.userName, u.avartarPath);
        }
      });

    });

  }



  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.isSearchMessage = !this.isSearchMessage;
    this.isExpandListUser != this.isExpandListUser;
  }

  getInfoGroup(): void {
    console.log('Hiển thị thông tin về đoạn chat');
  }

  editGroup(): void {
    console.log('Tùy chỉnh trong đoạn chat');
  }

  getUserInGroup(groupId: any): void {
    if (!this.isExpandListUser) {
      this.groupService.getUserForGroup(groupId).subscribe(rs => {
        this.listUserForGroup = rs;
      })
      this.isExpandListUser = true;
      setTimeout(() => {
        this.scrollToBottomUsers();
      }, 0);
    } else {
      this.isExpandListUser = false;
    }

  }
  scrollToBottomUsers() {
    if (this.lastItem) {
      this.lastItem.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  toggleAddUser() {
    this.isAddingUser = !this.isAddingUser;

  }


  addUserInGroup() {
    const input = {
      groupId: this.groupIdCurrent,
      userName: this.newUserName
    } as AddUserInGroup;
    this.groupService.addUserInGroup(input).subscribe({
      next: () => {
        this.isAddingUser = false;
        //content: string; userSender: string; groupName: string; createTime: string
        const newMessage = [{
          content: this.username + " đã thêm " + this.newUserName + " vào nhóm !",
          userSender: this.username,
          groupName: this.groupName,
          createTime: new Date().toISOString(),
        }];

        this.message = this.username + " đã thêm " + this.newUserName + " vào nhóm !";

        this.sendMessage('/app/chat', newMessage);
        this.userService.getUserByName(this.newUserName).subscribe({
          next: (user) => {
            this.listUserForGroup.push(user);
          },
          error: (err) => {
            console.error("Lỗi khi lấy thông tin người dùng: ", err);
          }
        }); this.newUserName = '';

      }
    })
  }



  isToggleSearch(): void {
    this.isSearchMessage = !this.isSearchMessage;
    this.searchMessage = '';
    this.listMessageSearch = [];
  }
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100); // Thay đổi thời gian nếu cần
  }
  showMessageInGroup(group: GroupDto) {
    if (group.groupType === 'PRIVATE') {
      var user = group.users.find(user => user.userName !== this.username);
      this.nameGroupCurrent = user?.userName;
      this.linkAvartarGroupCurrent = user?.avartarPath;
      this.groupIdCurrent = group.id;
      this.groupName = group.nameGroup
    }
    else {
      this.groupName = group.nameGroup;
      this.nameGroupCurrent = group.nameGroup;
      this.linkAvartarGroupCurrent = group.avartarPath;
      this.groupIdCurrent = group.id;
    }

    this.messageService.getAllMessageInGroup(group.nameGroup).subscribe((messages: MessageDto[]) => {
      this.messages = messages;
      this.scrollToBottom();
    });

    this.disconnect();
    this.connect();
  }

  getGroupByName(groupName: string) {
    this.groupService.searchGroup(groupName).subscribe((groups: GroupDto[]) => {
      this.listGroupForUser = groups;
    })
  }
  getAvatarLink(): string {
    return this.linkAvartarGroupCurrent
      ? this.linkAvartarGroupCurrent
      : 'https://www.dropbox.com/scl/fi/qo5m886umhvuumf13neo1/2024-12-18-16-14-15Screenshot-2024-02-23-200416.png?rlkey=cg0zdshataauuojotf8ue4s9j&raw=1';
  }
  private stompClient: Stomp.Client | null = null;

  connect(): void {
    const wsUrl = 'ws://localhost:8081/ws'; // Địa chỉ WebSocket từ server
    this.stompClient = new Stomp.Client({
      brokerURL: wsUrl, // Sử dụng WebSocket URL trực tiếp
      debug: (msg: string) => console.log(msg),
      reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu bị ngắt kết nối
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Lắng nghe sự kiện khi kết nối thành công
    this.stompClient.onConnect = (frame) => {
      console.log('Connected:', frame);

      // Đăng ký nhận tin nhắn từ server
      this.stompClient?.subscribe('/topic/messages/' + this.groupName, (message) => {

        var tmp = JSON.parse(message.body);
        if (tmp.userSender != this.username) {
          this.messages.push({
            id: 0,
            userSender: tmp.userSender,
            content: tmp.content,
            createTime: new Date().toISOString(),
            groupName: this.groupName,
          });
        }

        this.scrollToBottom();
      });
    };

    // Lắng nghe lỗi
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };

    // Kết nối WebSocket
    this.stompClient.activate();
  }

  sendMessage(destination: string, messages: {}[]): void {
    if (this.stompClient && this.stompClient.connected && this.message.trim()) {
      const messagePayload = {
        userSender: this.username,
        content: this.message,
        createTime: new Date().toISOString(),
        groupName: this.groupName,
      };

      this.stompClient.publish({
        destination: `/app/chat`,
        body: JSON.stringify(messagePayload),
      });



      messages.push({
        userSender: this.username,
        content: this.message,
        createTime: new Date().toISOString(),
        groupName: this.groupName,
      });

      this.message = '';
      this.scrollToBottom();
      // this.userService.getAllGroupForUser(this.username).subscribe((group: GroupDto[]) => {
      //   this.listGroupForUser = group;
      // });
      const updatedGroupIndex = this.listGroupForUser.findIndex(g => g.nameGroup === this.groupName);
      if (updatedGroupIndex > -1) {
        const [updatedGroup] = this.listGroupForUser.splice(updatedGroupIndex, 1);
        this.listGroupForUser.unshift(updatedGroup);
      }
  
    } else {
      console.error('Unable to send message: Not connected to WebSocket or message is empty.');
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('WebSocket disconnected.');
    }
  }

  getUserName(group: GroupDto): string | undefined {
    var user = group.users.find(user => user.userName !== this.username);
    return user?.userName;
  }

  getAvatarPath(group: GroupDto): string {
    if (!group || !group.users) {
      console.error("Group or listUser is undefined:", group);
      return 'https://cdn.mezon.vn/1779484504377790464/1833341515963830272/1831544914039541800/273_undefinedScreenshot_2024_11_09_224436.png';
    }

    const user = group.users.find(user => user.userName !== this.username);
    return user?.avartarPath || 'https://cdn.mezon.vn/1779484504377790464/1833341515963830272/1831544914039541800/273_undefinedScreenshot_2024_11_09_224436.png';
  }

  isPublicGroup(group: any): boolean {
    return group.groupType === 'PUBLIC';
  }

  isPrivateGroup(group: any): boolean {
    return group.groupType === 'PRIVATE';
  }

  navigateToComponent() {
    this.router.navigate(['/target-component-route']);
    this.isCategorySidebarOpen = false;
  }

  toggleCategorySidebar() {
    this.isCategorySidebarOpen = !this.isCategorySidebarOpen;
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(target: HTMLElement): void {
    const clickedInside = target.closest('.search-bar') || target.closest('.dropdown-menu');
    if (!clickedInside) {
      this.isCategorySidebarOpen = false;
    }
  }

  openGroupForm() {
    const dialogRef = this.dialog.open(GroupComponent, {
      width: '500px',
      data: { username: this.username }, // Truyền dữ liệu nếu cần
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.getAllGroupForUser(this.username).subscribe((group: GroupDto[]) => {
          this.listGroupForUser = group;

        });
        this.showMessageInGroup(result);
        this.linkAvartarGroupCurrent = result.avartarPath
      } else {
        console.log('Form closed without submission');
      }
    });
  }

  updateInfoUserDialog(): void {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '800px',
      data: this.userCurrent
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
        // Cập nhật dữ liệu trên UI mà không cần refresh
        const index = this.listUser.findIndex(u => u.id === updatedUser.id);
        if (index > -1) {
          this.listUser[index] = updatedUser; // Cập nhật trực tiếp vào danh sách
        }
      }
    });
  }

  searchMessageInGroup() {

    const search = this.searchMessage;
    const groupId = this.groupIdCurrent;
    this.messageService.searchMessage(search, groupId).subscribe(rs => {
      this.listMessageSearch = rs
    }
    )
  }

  redirectToUser(friendName: any) {
    if (friendName != this.username) {
      this.groupService.getFriend(this.username, friendName).subscribe(rs => {
        if (rs == null) {
          this.groupService.addFriend(this.username, friendName).subscribe(res => {
            this.userService.getAllGroupForUser(this.username).subscribe((group: GroupDto[]) => {
              this.listGroupForUser = group;
              this.showMessageInGroup(group[0]);
            });
          })
        } else {
          this.groupService.searchGroup(rs.nameGroup).subscribe(rs => {
            const groupdto = rs[0] as GroupDto;
            this.showMessageInGroup(groupdto);
          })

        }

      })

    }
  }

  outGroup() {
    console.log('Button clicked!'); // Đảm bảo phương thức được gọi
    this.groupService.outGroup(this.groupIdCurrent, this.username);
  
    const updatedGroupIndex = this.listGroupForUser.findIndex(g => g.nameGroup === this.groupName);
    if (updatedGroupIndex > -1) {
      this.listGroupForUser.splice(updatedGroupIndex, 1);
    }
  }
  
  

  call() {
    {
      this.router.navigate(['call'], { state: { groupName: this.nameGroupCurrent,userName : this.username } })
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
      this.fileService.uploadFile(this.uploadFile).subscribe({
        next: (response:any) => {
          this.linkImage = response.url;
          this.message = response.url;
          console.log('File uploaded successfully. URL:', response.url);
        },
        error: (error: any) => {
          console.error('Upload error:', error);
        },
      });
    }
  }
  isImageUrl(url: string): boolean {
    
    const imageExtensions = ['jpeg', 'jpg', 'gif', 'png', 'webp', 'svg'];
    return imageExtensions.some(extension => url.includes(extension));
  }
  isFileUrl(content: string): boolean {
    const fileExtensions = ['pdf', 'docx', 'xlsx', 'txt', 'zip', 'rar'];
    
    return fileExtensions.some(extension => content.includes(extension));
  }
  
  downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'file';
    link.target = '_blank';
    link.click();
  }
  
  
  logOut() {
    this.router.navigate(['login']);
  }

}

import { MatIconModule } from '@angular/material/icon'; import { CallService } from './service/api/callService';
import { Call } from '@stream-io/video-client';
import { FileService } from './service/api/fileService';

