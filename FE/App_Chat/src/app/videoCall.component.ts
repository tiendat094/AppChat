// import { UserService } from './service/api/userService';
// import { Component, Inject, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms'; // Ensure ReactiveFormsModule is imported
// import { FileService } from './service/api/fileService';
// import { UserDto } from './service/model/user.dto';
// import { HttpClientModule } from '@angular/common/http';
// import { VideoCallService } from './service/api/videoCallService';
// import { ViewChild,ElementRef } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { Client } from '@stomp/stompjs'; // Import Client and over from stompjs
// import SockJS from 'sockjs-client'; // Import SockJS
// import * as Stomp from '@stomp/stompjs';
// @Component({
//   selector: 'app-videoCall',
//   standalone: true,
//   providers: [UserService, FileService,VideoCallService],
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatIconModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     ReactiveFormsModule,HttpClientModule,MatDialogModule,
//   ],
//   template: `
//      <mat-dialog-content>
//   <div class="video-call-container">
//     <!-- Video hiển thị local stream -->
//     <video #localVideo autoplay muted></video>

//     <!-- Video hiển thị remote stream -->
//     <video #remoteVideo autoplay></video>
//   </div>
//   <div class="video-call-actions">
//     <button mat-button color="primary" (click)="call()">Gọi</button>
//     <!-- <button mat-button color="warn" (click)="endCall()">Kết thúc</button> -->
//   </div>
// </mat-dialog-content>
//   `,
//   styles: [
//     `
// .video-call-container {
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   flex-direction: row;
//   gap: 20px;
//   height: 300px;
// }

// video {
//   width: 45%;
//   height: 100%;
//   border-radius: 10px;
//   border: 2px solid #ccc;
//   background-color: black;
// }

// .video-call-actions {
//   display: flex;
//   justify-content: space-between;
//   margin-top: 20px;
// }
//     `,
//   ],
// })
// export class VideoCallComponent implements OnInit {
//   @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
//   @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
//  // private stompClient!: Client; // Use Client type from stompjs
//   private localStream!: MediaStream;
//   private peerConnection!: RTCPeerConnection;

//   constructor(private signalingService: VideoCallService) {}

//   async ngOnInit() {
//     this.initializeWebSocketConnection();
//     this.localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     this.localVideo.nativeElement.srcObject = this.localStream;

//     this.peerConnection = new RTCPeerConnection();

//     this.localStream.getTracks().forEach((track) => {
//       this.peerConnection.addTrack(track, this.localStream);
//     });

//     this.peerConnection.ontrack = (event) => {
//       const [remoteStream] = event.streams;
//       this.remoteVideo.nativeElement.srcObject = remoteStream;
//     };

//     this.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.signalingService.sendMessage({ candidate: event.candidate });
//       }
//     };

//     this.signalingService.onMessage(async (message) => {
//       if (message.sdp) {
//         await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
//         if (message.sdp.type === 'offer') {
//           const answer = await this.peerConnection.createAnswer();
//           await this.peerConnection.setLocalDescription(answer);
//           this.signalingService.sendMessage({ sdp: this.peerConnection.localDescription });
//         }
//       } else if (message.candidate) {
//         await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
//       }
//     });
//   }

//   private stompClient: Stomp.Client | null = null;
//  initializeWebSocketConnection() {
//     const wsUrl = 'ws://localhost:8081/ws'; // Địa chỉ WebSocket từ server
//     this.stompClient = new Stomp.Client({
//       brokerURL: wsUrl, // Sử dụng WebSocket URL trực tiếp
//       debug: (msg: string) => console.log(msg),
//       reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu bị ngắt kết nối
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//     });
//   }

//   sendMessage(destination: string, message: any) {
//     if (this.stompClient && this.stompClient.connected) {
//       this.stompClient.publish({ destination: destination, body: JSON.stringify(message) });
//     }
//   }

//   subscribe(destination: string, callback: (message: any) => void) {
//     if (this.stompClient && this.stompClient.connected) {
//       this.stompClient.subscribe(destination, (message) => {
//         callback(JSON.parse(message.body));
//       });
//     }
//   }

//   async call() {
//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(offer);
//     this.signalingService.sendMessage({ sdp: this.peerConnection.localDescription });
//   }
// }