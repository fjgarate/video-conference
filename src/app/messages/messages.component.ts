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
  change: [];
  last_message: Message;
  user_conversation: User;
  conversations: Conversation[] = [];
  conversation2: Conversation;
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

    console.log('Han llegado', this.messages);
    this.messageForm = this.formBuilder.group({
      text: [''],
      author: this.currentUser.firstName + ' ' + this.currentUser.lastName,
      read: false
    });
    this.sub = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.conver_p = params['conver_p'];
    });
  console.log('Conver', this.conver_p);
  this.getConversationsById();
   //this.updateConver();
  }
  get f() { return this.messageForm.controls; }


  getConversationsById() {
    this.convesationSrv
      .getById(this.currentUser.token, this.conver_p)
      .pipe(first())
      .subscribe(conversation => {
        console.log('Conversaciones', conversation);
        this.conversation = conversation;
        this.conversation2 = conversation;
console.log('Con2',this.conversation2)
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
      console.log('ENviado')
    }

   updateConver() {
    this.messages = this.conversation2.messages.filter((item) => item.read = true);
     this.convesationSrv.updateConversation(this.currentUser.token, this.conver_p, this.conversation2)
        .pipe(first())
        .subscribe(
          data => {
            this.conversation2 = data;
          },
          error => { console.log(error)
          });

  }

}