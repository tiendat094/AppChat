import { MailService } from './../service/api/mailService';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-confirmOtp',
  standalone: true,
  providers: [MailService],
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule ],
  template: `
    <div class="otp-container">
  <h2 class="otp-title">Enter Verification Code</h2>
  <p class="otp-description">
    We've sent a 4-digit verification code to your email. Please enter it below.
  </p>
  <form (ngSubmit)="verifyOtp()">
    <div class="otp-inputs">
      <input
        *ngFor="let digit of otpArray; let i = index"
        type="text"
        class="otp-input"
        maxlength="1"
        [(ngModel)]="otpArray[i]"
        name="otp-{{ i }}"
        required
        (input)="moveToNext($event, i)"
        autofocus
      />
    </div>
    <button type="submit" class="btn btn-primary">Verify</button>
  </form>
  <p class="otp-resend">
    Didn't receive the code? <a href="#" class="otp-link" (click)="resendCode()">Resend Code</a>
  </p>
</div>


  `,
  styles: [
    `
.otp-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.otp-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.otp-description {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #666;
}

.otp-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.otp-input {
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.otp-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.otp-resend {
  font-size: 0.9rem;
  color: #666;
}

.otp-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.otp-link:hover {
  text-decoration: underline;
}

    `,
  ],
})
export class ConfirmOtpComponent implements OnInit{
    otpArray: string[] = ['', '', '', ''];
    public email ='';
   constructor(private route: Router,private mailService:MailService){
    
   }

   ngOnInit(): void {
    this.email = history.state.email;
   }
moveToNext(event: any, index: number): void {

  if (event.target.value.length === 1 && index < this.otpArray.length - 1) {
    const nextInput = event.target.nextElementSibling;
    if (nextInput) {
      nextInput.focus();
    }
  } else if (event.target.value.length > 1) {
    event.target.value = event.target.value.charAt(0);
  }
}

    verifyOtp(): void {
      const otpCode = this.otpArray.join('').toString();
      if (otpCode.length === 4) {
        this.mailService.verifyOtp(this.email,otpCode).subscribe(rs => {
          if(rs){
            this.route.navigate(['resetPassword'],{state: {email: this.email}});
          }
        })
      } else {
        alert('Please enter a valid 4-digit OTP.');
      }
    }

    resendCode(): void {
      
    }
    
  }


