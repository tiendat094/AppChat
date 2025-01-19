import { UserService } from './service/api/userService';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Ensure ReactiveFormsModule is imported
import { FileService } from './service/api/fileService';
import { UserDto } from './service/model/user.dto';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [UserService, FileService],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,HttpClientModule
  ],
  template: `
    <div class="form-container">
      <form [formGroup]="updateForm" (ngSubmit)="onSubmit()">
        <div class="form-content">
          <!-- Avatar Section -->
          <div class="avatar-container">
            <div class="file-upload">
              <label for="avatar">Avatar</label>
              <input type="file" id="avatar" accept="image/*" (change)="onFileChange($event)" />
              <div id="avatarPreview" class="avatar-preview">
                <img *ngIf="avartarPath" [src]="avartarPath" alt="Avatar Preview" />
              </div>
            </div>
          </div>

          <!-- Input fields Section -->
          <div class="input-fields-container">
            <div class="form-group">
              <label for="userName">User Name</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your user name"
                formControlName="userName"
                [(ngModel)]="userName"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                formControlName="email"
                [(ngModel)]="email"
              />
            </div>

            <!-- <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                formControlName="password"
                [(ngModel)]="password"
              />
            </div> -->

            <div class="form-group">
              <label for="sex">Sex</label>
              <select id="sex" formControlName="sex" [(ngModel)]="sex">
                <option value="0">Male</option>
                <option value="1">Female</option>
                <option value="2">Other</option>
              </select>
            </div>

            <!-- Button Section -->
            <div class="button-container">
              <button type="button" class="cancel-btn" (click)="onCancel()">Cancel</button>
              <button type="submit" class="submit-btn" [disabled]="!updateForm.valid">Update</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
      }

      .form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        max-width: 100%;
      }

      .form-content {
        display: flex;
        flex-direction: row;
        gap: 20px; /* Khoảng cách giữa avatar và input */
        max-width: 100%; /* Bảo đảm layout không vượt viewport */
        align-items: flex-start;
      }

      .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px; /* Cố định chiều rộng của Avatar */
      }

      .file-upload label {
        font-weight: 500;
        margin-bottom: 8px;
        text-align: center;
      }

      .file-upload input {
        display: none;
      }

      .avatar-preview img {
        border-radius: 50%;
        width: 100%; /* Avatar chiếm toàn bộ chiều rộng container */
        height: auto;
        object-fit: cover;
      }

      .input-fields-container {
        display: flex;
        flex-direction: column;
        width: 100%; /* Input chiếm toàn bộ không gian còn lại */
        max-width: 500px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        display: block;
      }

      input[type='text'],
      input[type='email'],
      input[type='password'],
      select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .button-container {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      button {
        padding: 10px 20px;
        font-size: 14px;
        border: none;
        cursor: pointer;
        border-radius: 4px;
      }

      .cancel-btn {
        background-color: #f44336;
        color: white;
      }

      .submit-btn {
        background-color: #3f51b5;
        color: white;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  updateForm: FormGroup;
  avatarFile: File | null = null;
  avartarPath = '';
  email = '';
  userName = '';
  sex: any;
  private sexMapping: { [key: string]: number } = {
    Male: 0,
    Female: 1,
    Other: 2,
  };
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserComponent>,private userService: UserService,private fileService :FileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sex: ['', Validators.required],
      avatar: ['']
    });
  }

  ngOnInit(): void {
    this.avartarPath = this.data.avartarPath || '';
    this.email = this.data.emailAddress || '';
    this.userName = this.data.userName || '';
    this.sex = this.sexMapping[this.data.sex];
  }

  onFileChange(event: Event) {
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
    }
  }

  onSubmit(): void {

    const input = {
        //id : this.data.id,
        userName: this.userName,
        avartarPath: this.avartarPath,
        sex : this.sex,
        emailAddress: this.email,
       
    } as UserDto;
    this.userService.updateUser(input).subscribe( rs => {
         this.dialogRef.close(input);
    })
    
  }

  onCancel(): void {
    this.updateForm.reset();
    this.dialogRef.close();
  }
}
