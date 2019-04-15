import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Message } from '../models/message';
import { Conversation } from '../models/conversation';

@Injectable({
  providedIn: "root"
})
export class ConversationService {
  constructor(private http: HttpClient) {}

  getAll(token: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      "https://login-videocall.herokuapp.com" + "/conversations",
      options
    );
  }
  getConversationsByUserId(token: string, id: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      "https://login-videocall.herokuapp.com" + "/conversations/user"+"/"+id,
      options
    );
  }

  addMessage(token: string, id: string, newMessage: Message) {
    console.log('register');
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.put<any>(
      'https://login-videocall.herokuapp.com' + '/conversations/' + id,
      newMessage,
      options
    );
}

  createConversation(newConversation: Conversation) {
    console.log('Conversacion creada');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      })
    };
    return this.http.post<any>(
    'https://login-videocall.herokuapp.com' + '/conversations/register',
newConversation, options
    );
  }
}
