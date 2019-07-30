import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Message } from '../models/message';
import { Conversation } from '../models/conversation';
import { environment } from './../../../environments/environment';
import { SelectionModel } from '@angular/cdk/collections';

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
      environment.api_url + "/conversations",
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
      environment.api_url + "/conversations/user"+"/"+id,
      options
    );
  }

  getById(token: string, id: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/conversations" + "/" + id,
      options
    );
  }

  addMessage(token: string, id: string, newMessage: Message) {
    console.log('register');
    console.log(newMessage);

    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.put<any>(
      environment.api_url + '/conversations/' + id,
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
    environment.api_url + '/conversations/register',
    newConversation, options
    );
  }

  updateConversation(token: string, id: string, newConversation: Conversation) {
    console.log('Conversacion actualizada');
    console.log('Con',newConversation);
    console.log('id',id);
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }) 
    };
    return this.http.put<any>(
      environment.api_url + '/conversations/update/' + id,
      newConversation,
      options 
      );

  }

  deleteConver (token: string, id: string){
    console.log('Eliminada')
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.delete<any>(
      environment.api_url + '/conversations/' + id,
      options
    );
  }
 /* deleteConversations(token: string, ids: SelectionModel<Conversation>){
    let status='';
    try {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    ids.selected.forEach(row => {
      console.log('borra: ',row.id)
      this.http.delete<any>(
        environment.api_url + '/conversations/' + row.id,
        options
     
      )
    });
    
    return 'true';
    }
    catch (error) {
      console.error(error);
      return 'false'
    }

  }*/

}
