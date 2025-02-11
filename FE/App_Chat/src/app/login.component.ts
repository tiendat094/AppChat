import { MessageService } from './service/api/messageService';
import { GroupService } from './service/api/groupService';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './service/api/userService';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginUserDto } from './service/model/user.dto';
import { RouterModule } from '@angular/router';
import { Call } from '@stream-io/video-client';
import { CallService } from './service/api/callService';
@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UserService, MessageService, GroupService,CallService],
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule ],
  template: `
    <div class="container">
      <div class="card">

        <div class="title">
          <h2>Sign In</h2>
          <p>Welcome back! Please enter your details.</p>
        </div>

        <form (submit)="login()">
        <div *ngIf="errorMessage" class="error-message">
  {{ errorMessage }}
</div>
          <div class="form-group">
            <label for="email">UserName</label>
            <input
              id="userName"
              type="userName"
              placeholder="Enter your UserName"
              [(ngModel)]="username"
              name="username"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              placeholder="Enter your password"
              name="password"
              required
            />
          </div>

          <div class="options">
            <label>
              <input type="checkbox"  /> Remember me
            </label>
            <a  [routerLink]="'/sendmail'">Forgot Password?</a>
          </div>
          <button type="submit" class="btn">Login</button>

          <p class="signup-link">
            Don't have an accounts?
            <a [routerLink]="'/register'">Register here</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      /* Container */
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f4f7fc;
      }

      /* Card */
      .card {
        background: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
        box-sizing: border-box;
      }

      /* Title */
      .title {
        text-align: center;
        margin-bottom: 20px;
      }
      .title h2 {
        margin: 0;
        color: #333;
        font-size: 24px;
        font-weight: bold;
      }
      .title p {
        color: #777;
        font-size: 14px;
        margin: 5px 0 0;
      }

      /* Form Group */
      .form-group {
        margin-bottom: 15px;
      }
      .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #555;
        font-weight: 500;
      }
      .form-group input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.3s ease;
      }
      .form-group input:focus {
        border-color: #3b82f6;
      }

      /* Options */
      .options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        font-size: 14px;
      }
      .options label {
        color: #555;
        display: flex;
        align-items: center;
      }
      .options a {
        text-decoration: none;
        color: #3b82f6;
        font-weight: 500;
      }
      .options a:hover {
        text-decoration: underline;
      }

      /* Button */
      .btn {
        display: block;
        width: 100%;
        padding: 12px;
        background-color: #3b82f6;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #2563eb;
      }

      /* Sign Up Link */
      .signup-link {
        text-align: center;
        margin-top: 15px;
        color: #777;
        font-size: 14px;
      }
      .signup-link a {
        color: #3b82f6;
        text-decoration: none;
        font-weight: bold;
      }
      .signup-link a:hover {
        text-decoration: underline;
      }
      .error-message {
  color: #e74c3c; /* Màu đỏ */
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
}
    `,
  ],
})
export class LoginComponent {
  public username = '';
  public password = '';
 public errorMessage='';

  constructor(private router: Router,private userService: UserService,private callService : CallService) {}

  login() {
    // Chuẩn bị dữ liệu đầu vào
    const input = {
      username: this.username.trim(),
      password: this.password.trim(),
    };

    if (!input.username || !input.password) {
      this.errorMessage = 'Username and password are required!';
      return;
    }

    this.userService.login(input).subscribe(
      async (response) => {
        if (response) {
          try {

            //await this.callService.initializeClient(input.username);
            this.router.navigate(['/chat'], { state: { username: input.username } });
          } catch (error) {
            this.errorMessage = 'Failed to initialize video client. Please try again later.';
            console.error('CallService error:', error);
          }
        } else {

          this.errorMessage = 'Invalid username or password!';
          this.clearLoginFields();
        }
      },
      (error) => {

        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('Login error:', error);
      }
    );
  }


  private clearLoginFields() {
    this.username = '';
    this.password = '';
  }


   forgetPassword(){
    this.router.navigate(['/sendmail']);
   }

  }


