import { Subject } from 'rxjs';
import { MailService } from './../service/api/mailService';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { UserService } from '../service/api/userService';
@Component({
  selector: 'app-resetPassword',
  standalone: true,
  providers: [MailService,UserService],
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule ,ReactiveFormsModule],
  template: `
 <div class="reset-password-container">
  <h2>Reset Password</h2>
  <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="newPassword">New Password</label>
      <input
        type="password"
        id="newPassword"
        formControlName="newPassword"
        placeholder="Enter your new password"
        class="form-control"
      />
      <small *ngIf="resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched">
        Password is required and must be at least 6 characters.
      </small>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        formControlName="confirmPassword"
        placeholder="Confirm your new password"
        class="form-control"
      />
      <small *ngIf="resetPasswordForm.hasError('passwordMismatch') && resetPasswordForm.get('confirmPassword')?.touched">
        Passwords do not match.
      </small>
    </div>

    <button type="submit" class="btn btn-primary" [disabled]="resetPasswordForm.invalid">Update Password</button>
  </form>
</div>

  `,
  styles: [
    `
.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.reset-password-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-control {
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

small {
  color: red;
  font-size: 12px;
}

    `,
  ],
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm!: FormGroup;
    email = ''
    constructor(
      private fb: FormBuilder,
      private router: Router,private userService: UserService
    ) {}
  
    ngOnInit(): void {
      this.resetPasswordForm = this.fb.group(
        {
          newPassword: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
        },
        { validators: this.passwordsMatchValidator }
      );
      this.email = history.state.email
    }
  
    passwordsMatchValidator(formGroup: FormGroup) {
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }
  
   onSubmit(): void {
  if (this.resetPasswordForm.valid) {
    const rs = {
      email: this.email,
      password: this.resetPasswordForm.value.newPassword, // Truyền đúng giá trị password
    };

    this.userService.updatePassword(rs).subscribe({
      next: (response) => {
        console.log('API đã được gọi thành công:', response);
       
      }
    }); this.router.navigate(['login']);
  }
}

  }

