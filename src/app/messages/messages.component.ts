import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';
import { Message } from '../shared/models/message';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { User } from '../shared/models';
import { Conversation } from '../shared/models/conversation';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthenticationService, UserService } from '../shared/services';
import { ConversationService } from '../shared/services/conversation.service';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  messageForm: FormGroup;
  currentUser: User;
  currentUserSubscription: Subscription;
  conversation: Conversation[]=[];
  conversationParams: Conversation;
  change: [];
  last_message: Message;
  user_conversation: User;
  conversations: Conversation[] = [];
  conversation2: Conversation;
  conversation3: Conversation;
  messages3: Message[] = [];

  conver_p = '';
  private sub: any;
  participants: string[] = [];



  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private convesationSrv: ConversationService,
    private route: ActivatedRoute

) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
     }

  ngOnInit() {
    //this.sharedService.currentMessage.subscribe(message => this.messages = message);

    this.messageForm = this.formBuilder.group({
      text: [''],
      author: this.currentUser.firstName + ' ' + this.currentUser.lastName,
      read: false
    });
    this.sub = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.conver_p = params['conver_p'];
    });
  this.getConversationsById();
  }
  get f() { return this.messageForm.controls; }


  getConversationsById() {
    this.convesationSrv
      .getById(this.currentUser.token, this.conver_p)
      .pipe(first())
      .subscribe(conversation => {
        console.log('Conversaciones', conversation);
        this.conversation = conversation;
        this.conversationParams = conversation;
        this.conversation2 = conversation;
        this.conversation3 = conversation;
        this.messages3 = this.conversation3.messages.filter((item) => item.author != this.currentUser.firstName + ' ' + this.currentUser.lastName).filter((item)=> item.read = true) ;
        this.updateConver();
});
  }


    submitNewM() {
    this.convesationSrv.addMessage(this.currentUser.token, this.conver_p, this.messageForm.value)
      .pipe(first())
        .subscribe(
          data => {
            this.conversations = data;
          },
          error => {
          });
      this.getConversationsById();
    }

   updateConver() {
     this.convesationSrv.updateConversation(this.currentUser.token, this.conver_p, this.conversation3)
        .pipe(first())
        .subscribe(
          data => {
            this.conversation3 = data;
          },
          error => { console.log(error)
          });

  }

}