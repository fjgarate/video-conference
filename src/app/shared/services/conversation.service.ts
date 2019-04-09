import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from '../models/user';

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
}

