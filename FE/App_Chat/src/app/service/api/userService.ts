
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDto, LoginUserDto, UserDto } from '../model/user.dto';  // Đảm bảo bạn có model UserDto

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8081/user'; // API URL

  constructor(private http: HttpClient) { }

  // Phương thức sử dụng HttpClient để lấy tất cả người dùng
  getAllUser(): Observable<UserDto[]> {
    var url = this.apiUrl+"/getAllUser"
    return this.http.get<UserDto[]>(url);
  }

  getAllGroupForUser(userName: string): Observable<GroupDto[]>{
    const params = {userName}
    return this.http.get<GroupDto[]>(`${this.apiUrl}/getAllGroupForUser`, {params});
  }
  
  login(input: any):Observable<boolean>{
    const params = {input};
    return this.http.post<boolean>(`${this.apiUrl}/login`,input);
  }
 
  getUserByName(userName: string):Observable<UserDto>{
    const params = {userName};
    return this.http.get<UserDto>(`${this.apiUrl}/getUserByName`,{params});
  }

  registerUser(userDto: LoginUserDto):Observable<any>{
      return this.http.post<LoginUserDto>(`${this.apiUrl}/sighUp`,userDto)
  }
  
  updateUser(userDto: UserDto){
    return this.http.put<any>(`${this.apiUrl}/updateUser`,userDto);
  }

  updatePassword(rs: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updatePassword`, rs);
  }
  

}
