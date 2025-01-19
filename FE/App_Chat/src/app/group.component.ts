import { FileService } from './service/api/fileService';
import { MessageService } from './service/api/messageService';
import { GroupService } from './service/api/groupService';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './service/api/userService';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginUserDto } from './service/model/user.dto';
import { RouterModule } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; // Add this import
import { MatInputModule } from '@angular/material/input'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Ensure FormGroup is imported
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Add this import
import { AddGroupDto } from './service/model/group.dto';
@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UserService, MessageService, GroupService,FileService],
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule ,MatCardModule,ReactiveFormsModule,MatIconModule
    , MatFormFieldModule, MatInputModule],
  template: `
  <div class="form-container">
  <mat-card class="custom-card">
    <div class="card-header">
      <mat-card-title>🌟 Customize Your Clan</mat-card-title>
      <button mat-icon-button class="close-button" (click)="closeForm()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-card-content>
      <form [formGroup]="clanForm" (ngSubmit)="onSubmit()">
        <!-- Upload Icon -->
        <div class="upload-container">
          <label for="upload-icon" class="upload-label">
            <input type="file" id="upload-icon" hidden (change)="onFileSelected($event)" />
            <div class="upload-button">
            <ng-container *ngIf="avartarFile; else altText">
        <img [src]="avartarFile" [alt]="avartarFile" />
      </ng-container>
      <ng-template #altText>
        <span>{{ "Upload Image" }}</span>
      </ng-template>
            </div>
          </label>
        </div>

        <!-- Clan Name Input -->
        <div class="form-group">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label >Clan Name</mat-label>
            <input
              matInput
              formControlName="clanName"
              placeholder="Enter the clan name"
              [(ngModel)]="nameGroup"
            />
          </mat-form-field>
        </div>

        <!-- Buttons -->
        <div class="button-container">
          <button mat-stroked-button color="warn" type="button" (click)="closeForm()">Cancel</button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="clanForm.invalid"
          >
            Create
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>


  `,
  styles: [
    `
   /* Tổng thể */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.custom-card {
  width: 500px;
  background-color: #2c2f33;
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #23272a;
  border-bottom: 1px solid #40444b;
}

mat-card-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.close-button {
  position: absolute;
  right: 16px;
  top: 16px;
  color: #ff4d4d;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}

.close-button mat-icon {
  font-size: 20px;
}

mat-card-content {
  padding: 20px;
}

/* Upload Icon */
.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.upload-label {
  cursor: pointer;
  display: inline-block;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5865f2;
  color: #ffffff;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.upload-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%; /* Giữ hình ảnh tròn */
}

.upload-button span {
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.upload-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

.upload-button mat-icon {
  font-size: 36px;
}

.upload-button span {
  margin-top: 6px;
  font-size: 12px;
}

/* Clan Name Input */
mat-form-field {
  width: 100%;
  margin-bottom: 16px;
}

mat-error {
  color: #ff4d4d;
  font-size: 12px;
}

/* Buttons */
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  gap: 16px;
}

button {
  flex: 1;
  max-width: 150px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button.mat-stroked-button {
  color: #ff4d4d;
  border-color: #ff4d4d;
}

button.mat-stroked-button:hover {
  background-color: rgba(255, 77, 77, 0.1);
  box-shadow: 0 4px 6px rgba(255, 77, 77, 0.3);
}

button.mat-raised-button {
  background-color: #5865f2;
  color: #ffffff;
}

button.mat-raised-button:hover {
  background-color: #4752c4;
  box-shadow: 0 4px 6px rgba(88, 101, 242, 0.5);
}
.mat-form-field .mat-input-element {
  color: white !important;
}
    `,
  ],
})
export class GroupComponent implements OnInit{
  clanForm: FormGroup;
  nameGroup= " ";
  avartarFile =null;
  username="";
  public avatarFile: File | null = null;
  constructor(
    private fb: FormBuilder,private fileService: FileService,private groupService: GroupService,
    public dialogRef: MatDialogRef<GroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clanForm = this.fb.group({
      clanName: ['', [Validators.required, Validators.maxLength(64)]],
    });
    this.username = this.data.username;
  }
 ngOnInit(): void {
   
 }
 onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.avatarFile = input.files[0];
    this.fileService.uploadFile(this.avatarFile).subscribe({
      next: (response) => {
        this.avartarFile = response.url;
        console.log('File uploaded successfully. URL:', response.url);
      },
      error: (error) => {
        console.error('Upload error:', error);
      },
    });
  }
}
  onSubmit() {
    const group = {
      nameGroup : this.nameGroup,
      avartarPath : this.avartarFile,
      userName : this.username,
      groupType : 1
    } as AddGroupDto ;
    this.groupService.createGroup(group).subscribe( rs => {        
      this.dialogRef.close(group);
    })
    
  }

    closeForm() {
       this.dialogRef.close();
     }
  }


