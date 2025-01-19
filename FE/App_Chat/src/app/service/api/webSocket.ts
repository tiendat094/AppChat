import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private messageSubject = new Subject<any>();
  public message$ = this.messageSubject.asObservable();

  
  
  connect(groupId: string): void {
    const socket = new SockJS('http://localhost:8081/ws');
    this.stompClient = new Stomp.Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to websocket');
      this.subcribeToGroup(groupId);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker error: ', frame.headers['message']);
      console.error('Details: ', frame.body);
    };

    this.stompClient.activate();
  }

  subcribeToGroup(groupId: string): void {
    if (this.stompClient) {
      this.stompClient.subscribe(`/topic/group/${groupId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log('Received: ', parsedMessage);
        this.messageSubject.next(parsedMessage);
      });
    }
  }

  sendMessage(groupId: string, message: any): void {
    if (this.isConnected()) {
      this.stompClient?.publish({
        destination: `/app/group/${groupId}`,
        body: JSON.stringify(message),
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  }

  disconnect(): void {
    if (this.isConnected()) {
      this.stompClient?.deactivate();
      console.log('Disconnected from WebSocket');
    } else {
      console.log('STOMP client is not connected or already disconnected.');
    }
  }

  private isConnected(): boolean {
    return this.stompClient != null && this.stompClient.connected;
  }
}
