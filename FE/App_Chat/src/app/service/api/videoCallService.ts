import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../model/user.dto';  // Đảm bảo bạn có model UserDto
import { MessageDto } from '../model/message.dto';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {

  private apiUrl = 'http://localhost:8081/app/signal'; // API URL
  private socket: WebSocket; // Declare the socket property

  constructor() {
    this.socket = new WebSocket(this.apiUrl);
  }

  sendMessage(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  onMessage(callback: (message: any) => void) {
    this.socket.onmessage = (event) => callback(JSON.parse(event.data));
  }

}
