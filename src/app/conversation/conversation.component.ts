import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserService } from '../shared/services';
import { User } from '../shared/models';
import { Subscription } from 'rxjs';
import { ConversationService } from '../shared/services/conversation.service';
import { first } from 'rxjs/operators';
import { Conversation } from '../shared/models/concersation';
import { Message } from "../shared/models/message";
import * as crypto from "crypto-js";
@Component({
  selector: "app-conversation",
  templateUrl: "./conversation.component.html",
  styleUrls: ["./conversation.component.css"]
})
export class ConversationComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  conversations: Conversation[] = [];
  messages: Message[] = [];
  users: User[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private convesationSrv: ConversationService,
    private userService: UserService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {
    this.loadAllPatients();
    this.getConversationsByUserId(this.currentUser.id);
  }
  private loadAllPatients() {
    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(users => {
        console.log(users);
        this.users = users;
      });
  }
  private getConversationsByUserId(id: string) {
    this.convesationSrv
      .getConversationsByUserId(this.currentUser.token, id)
      .pipe(first())
      .subscribe(conversations => {
        console.log(conversations);
        this.conversations = conversations;
        if (this.conversations.length > 0){
          this.messages = this.conversations[conversations.length-1].messages;
        }
      });
  }
  pruebacall(userName) {
    console.log(userName);
    let ciphertext = crypto.AES.encrypt(
      JSON.stringify(userName),
      "secret key 123"
    ).toString();
    console.log(ciphertext);
    // Decrypt
    let bytes = crypto.AES.decrypt(ciphertext, "secret key 123");
    let decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));

    console.log(decryptedData); // [{id: 1}, {id: 2}]

  }
  createItem(conversation){
    console.log('conversation')
console.log(conversation)
  }

}
