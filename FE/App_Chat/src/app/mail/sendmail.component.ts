import { MailService } from './../service/api/mailService';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sendmail',
  standalone: true,
  providers: [MailService],
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  template: `
    <div class="card text-center shadow-sm" style="width: 350px; border-radius: 10px; margin: 0 auto; padding-top: 30px;">
      <div class="card-header h5 text-white bg-primary rounded-top "></div>
      <div class="card-body px-4 py-3">
        <p class="card-text ">
          Enter your email address and we'll send you an email with instructions to reset your password.
        </p>
        <div class="form-outline mb-3">
          <input
            type="email"
            [(ngModel)]="email"
            id="typeEmail"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="d-flex justify-content-between mt-4">
          <a (click)="backLogin()" class="text-decoration-none text-muted">Login</a>
          <a (click)="SendMailGetOtp()" class="text-decoration-none text-muted">Send Mail</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        max-width: 350px;
        width: 100%;
        margin: 0 auto;
        padding-top: 30px;
        box-sizing: border-box;
      }
      .card-header {
        font-size: 1.25rem;
      }
      .card-body {
        padding: 20px 30px;
      }
      .form-outline {
        margin-bottom: 16px;
      }
      .form-control {
        padding: 12px 15px;
        font-size: 22px;
      }
      .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
        border-radius: 50px;
        font-weight: 500;
        padding: 12px 0;
      }
      .d-flex {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        margin-top: 20px;
      }
      .d-flex a {
        padding: 8px 15px;
        border: 2px solid #007bff;
        border-radius: 30px;
        color: #007bff;
        font-weight: 500;
        text-align: center;
        width: 48%;
        text-decoration: none;
        transition: all 0.3s ease;
      }
      .d-flex a:hover {
        background-color: #007bff;
        color: white;
        transform: scale(1.05);
      }
      .card-text {
        text-align: center;
        white-space: nowrap;
        margin: 0 auto;
        width: 100%;
        margin-left: -174px;
      }
      @media (max-width: 768px) {
        .card {
          width: 90%;
        }
        .d-flex a {
          width: 48%;
        }
      }
    `,
  ],
})
export class SendMailComponent {
  public email: any;

  constructor(private router: Router, private mailService: MailService) {}

  // Kiểm tra email hợp lệ
  isValidEmail(email: string): boolean {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  SendMailGetOtp() {
    if (!this.isValidEmail(this.email)) {
      alert('Email không hợp lệ. Vui lòng nhập lại!');
      return;
    }
  
    this.mailService.sendMail(this.email).subscribe(response => {
           
    });
    this.router.navigate(['/verifyOtp'], { state: { email: this.email } });
  }
  

  backLogin() {
    this.router.navigate(['/login']);
  }
}
