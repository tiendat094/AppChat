import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDto, LoginUserDto, UserDto } from '../model/user.dto';  // Đảm bảo bạn có model UserDto

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl = 'http://localhost:8081/email'; // API URL

  constructor(private http: HttpClient) { }

  sendMail(email: string): Observable<any>{
    const params = {email}
    console.log(`${this.apiUrl}/sendmailOtp?email=${email}`);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.apiUrl}/sendmailOtp?email=${email}`, {}, { headers });
    
    
  }

  verifyOtp(email: string, otp: string) :Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/verifyOtp?email=${email}&otp=${otp}`, {});
  }
}