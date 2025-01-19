import { Component, Inject } from '@angular/core';
import { CallService } from '../service/api/callService';
import { CommonModule } from '@angular/common';
import { Router,RouterOutlet } from '@angular/router';
import { CallComponent } from './call/call.component';
import { FormsModule } from '@angular/forms';
import { state } from '@angular/animations';

@Component({
  selector: 'app-main-call',
  standalone: true,
  providers:[CallService],
  imports: [CommonModule, RouterOutlet, CallComponent,FormsModule],
  templateUrl: './main-call.component.html',
  styleUrl: './main-call.component.css'
})
export class MainCallComponent {
  callingService: CallService;
  public username:any;
   public callId =''
  constructor(@Inject(CallService) callingService: CallService) {
    this.callingService = callingService;
    this.username = history.state.username;
    this.callId = history.state.groupName;
  }

  setCallId(callId: string) {
    this.callingService.setCallId(callId);
  }
}

