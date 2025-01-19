import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../model/user.dto';  // Đảm bảo bạn có model UserDto
import { MessageDto } from '../model/message.dto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8081/message'; // API URL

  constructor(private http: HttpClient) { }

  getAllMessageInGroup(nameGroup: string): Observable<MessageDto[]> {
    const params = { nameGroup }; 
    return this.http.get<MessageDto[]>(`${this.apiUrl}/messageInGroup`, { params });
  }

  editMessage(messageId: number, newMessage: string) {
    // Sử dụng query parameters trong URL
    return this.http.put<any>(`${this.apiUrl}/editMessage?messageId=${messageId}&newMessage=${encodeURIComponent(newMessage)}`, {});
  }

  removeMessage(messageId: number) {
    const params = new HttpParams().set('messageId', messageId);
    return this.http.delete<any>(`${this.apiUrl}/deleteMessage`, { params });
  }

  searchMessage(searchMessage : any,groupId : number){
    return this.http.get<any>(`${this.apiUrl}/searchMessage?searchMessage=${searchMessage}&groupId=${groupId}`, {});
  }
}
