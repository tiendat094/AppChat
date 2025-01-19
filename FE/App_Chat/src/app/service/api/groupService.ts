import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDto, UserDto } from '../model/user.dto';  // Đảm bảo bạn có model UserDto
import { AddEventListenerOptions } from 'rxjs/internal/observable/fromEvent';
import { AddUserInGroup } from '../model/group.dto';
import { AddGroupDto } from '../model/group.dto';
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl = 'http://localhost:8081/group'; // API URL

  constructor(private http: HttpClient) { }

  // Phương thức sử dụng HttpClient để lấy tất cả người dùng
  getAllGroup(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>((`${this.apiUrl}/getAllGroupForUser`));
  }
  
  searchGroup(groupName : string): Observable<GroupDto[]>{
    const params = {groupName};
    return this.http.get<GroupDto[]>(`${this.apiUrl}/searchGroup`,{params})
  }
  getUserForGroup(groupId: any):Observable<any>{
    const params = {groupId};
    return this.http.get<any>(`${this.apiUrl}/getUserForGroup`,{params});
  }

  addUserInGroup(input : AddUserInGroup): Observable<any>{
    const params ={input};
    return this.http.post<any>(`${this.apiUrl}/addUserInGroup`,input);
  }

  createGroup(group : AddGroupDto):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/createGroup`,group);
  }

  getFriend(name1 : any, name2: any){
    return this.http.get<any>(`${this.apiUrl}/getFriend?name1=${name1}&name2=${name2}`, {});
  }

  addFriend(userCurrent : any,userFriend : any){
    return this.http.post<any>(`${this.apiUrl}/addFriend?userCurrent=${userCurrent}&userFriend=${userFriend}`, {});
  }

  outGroup(groupId: any, username : String){
    this.http.delete<any>(`${this.apiUrl}/outGroup?groupId=${groupId}&username=${username}`,{})
  }
}
