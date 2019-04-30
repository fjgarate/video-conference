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
  conversation: Conversation;
  change: [];
  last_message: Message;
  user_conversation: User;
  conversations: Conversation[] = [];
  conver_p = '';
  private sub: any;


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
    this.sharedService.currentMessage.subscribe(message => this.messages = message);

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
   // this.updateConver();


  }
  get f() { return this.messageForm.controls; }


  getConversationsById() {
    this.convesationSrv
      .getById(this.currentUser.token, this.conver_p)
      .pipe(first())
      .subscribe(conversations => {
        console.log('Conversaciones', conversations);
        this.conversations = conversations;

      });

  }

 /* updateConver() {
    this.convesationSrv.updateConversation(this.currentUser.token, '5cc7226aa5601d2e1c7d51fb', {'title':'Hola'})
  }*/


    submitNewM() {
    this.convesationSrv.addMessage(this.currentUser.token, this.conver_p, this.messageForm.value)
      .pipe(first())
      .subscribe(() => {
        this.sharedService.currentMessage.subscribe(message => this.messages = message);

        },
        error => {
        });
    console.log('Hola caracola', this.messageForm);

    }

}
