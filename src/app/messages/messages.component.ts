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
import { trigger, transition, animate, style } from '@angular/animations'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({
          height: '0px' }),
        animate('500ms ease-in', style({ height: '150px' }))
      ])
    ])
  ]
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
  isCollapsed: boolean = true;
  conver_p = '';
  private sub: any;
  participants: string[] = [];
  show = false;
  submitted=false;

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
      text: ['', Validators.required],
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
      this.submitted = true;
      if (this.messageForm.invalid) {
        return;
      }
      this.show=false
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
  expanse(event){
    console.log(event.srcElement.style.whiteSpace)
    if (event.srcElement.style.whiteSpace == 'nowrap') {
      event.srcElement.style.whiteSpace = 'normal';
    } else {
      event.srcElement.style.whiteSpace = 'nowrap';
    }
    
  }
  isToday(day: Date) {
    const today = new Date()
    const someDate = new Date(day)
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }
  toogleCollapse() {
    this.messageForm = this.formBuilder.group({
      text: ['', Validators.required],
      author: this.currentUser.firstName + ' ' + this.currentUser.lastName,
      read: false
    });
    this.submitted = false;
    this.isCollapsed = !this.isCollapsed;
  }
}