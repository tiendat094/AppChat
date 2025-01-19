import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from './service/api/userService';
import { LoginUserDto } from './service/model/user.dto';
import { FileService } from './service/api/fileService';
@Component({
  selector: 'app-register',
  standalone: true,
  providers:[FileService,UserService],
  imports: [FormsModule, CommonModule, RouterModule,HttpClientModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="title">
          <h2>Register</h2>
          <p>Create your account and get started!</p>
        </div>

        <form (submit)="register()">
          <!-- Error Message -->
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Username -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              [(ngModel)]="username"
              name="username"
              required
            />
          </div>
          <!-- Email -->
          <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          [(ngModel)]="emailAddress"
          name="email"
          required
        />
      </div>
          <!-- Password -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>

          <!-- Re-enter Password -->
          <div class="form-group">
            <label for="repassword">Re-enter Password</label>
            <input
              id="repassword"
              type="password"
              placeholder="Re-enter your password"
              [(ngModel)]="repassword"
              name="repassword"
              required
            />
          </div>

          <!-- Avatar Upload -->
          <div class="form-group">
            <label for="avatar">Upload Avatar</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              (change)="onFileSelected($event)"
            />
            <!-- Preview Image -->
            <div *ngIf="avatarPreview" class="avatar-preview">
              <img [src]="avatarPreview" alt="Avatar Preview" />
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn">Register</button>
          <p class="signup-link">
      Have already an account?
      <a [routerLink]="'/login'">Login here</a>
    </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
  padding: 20px;
}

.card {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  box-sizing: border-box;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group input[type="email"],
.form-group input[type="file"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.form-group input[type="file"] {
  padding: 8px;
  background-color: #f9f9f9;
}

.avatar-preview {
  margin-top: 15px;
  text-align: center;
}

.avatar-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #3b82f6;
}

.btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2563eb;
}

.error-message {
  color: #e74c3c;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
}

    `,
  ],
})
export class RegisterComponent {
  public username = '';
  public emailAddress ='';
  public password = '';
  public repassword = ''; // New field for Repassword
  public avatarFile: File | null = null; // File object
  public avatarPreview: string | null = null; // Preview URL
  public errorMessage = '';
  public avartarPath = '';
  constructor(private router: Router,private fileService : FileService,private userService: UserService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      this.avatarFile = input.files[0];
      this.fileService.uploadFile(this.avatarFile).subscribe({
        next: (response) => {
          this.avartarPath = response.url;
          console.log('File uploaded successfully. URL:', response.url);
        },
        error: (error) => {
          console.error('Upload error:', error);
        },
      });
  
      this.avatarPreview = URL.createObjectURL(this.avatarFile);
    }
  }
  register() {
    if (!this.username || !this.password || !this.repassword || !this.avatarFile) {
      this.errorMessage = 'All fields are required, including Avatar!';
      return;
    }

    if (this.password !== this.repassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    const userRe = {
     userName : this.username,
     password : this.password,
     emailAddress: this.emailAddress,
     avartarPath : this.avartarPath
    } as LoginUserDto;
    this.userService.registerUser(userRe).subscribe(rs => {
    this.router.navigate(['/login']);
    })

    
  }
}
