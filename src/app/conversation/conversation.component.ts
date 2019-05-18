import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserService } from '../shared/services';
import { User } from '../shared/models';
import { Subscription } from 'rxjs';
import { ConversationService } from '../shared/services/conversation.service';
import { first } from 'rxjs/operators';
import { Conversation } from '../shared/models/conversation';
import { Message } from "../shared/models/message";
import * as crypto from "crypto-js";
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { SharedService } from '../shared/services/shared.service';


@Component({
  selector: "app-conversation",
  templateUrl: "./conversation.component.html",
  styleUrls: ["./conversation.component.css"]
})
export class ConversationComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  conversations: Conversation[] = [];
  messageForm: FormGroup;
  conversationForm: FormGroup;
  firstMForm: FormGroup;
  loading = false;
  submitted = false;
  isCollapsed: boolean = true;
  isCreated: boolean = false;
  participants: string[] = [];
  conversation: Conversation;
  last_message: Message;
  user_conversation: User;
variable: boolean;
  variable2: string[] = [];
  name: string[] = [];



  messages: Message[] = [];
  users: User[] = [];
  pacientes: User[] = [];
  change: Conversation[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private convesationSrv: ConversationService,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,


  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }
  get isDoctor() {
    return this.currentUser && this.currentUser.role === 'doctor';
  }
  get isPatient() {
    return this.currentUser && this.currentUser.role === 'patient';
  }

  toogleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }


  ngOnInit() {
      this.conversationForm = this.formBuilder.group({
        createUsername: this.currentUser.id,
        title: [''],
        participants: [''],
        text:['']
      
            });


    this.loadAllPatients();
    this.getConversationsByUserId(this.currentUser.id);
  }
  get f() { return this.conversationForm.controls; }

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
        if (this.conversations.length > 0) {
          this.conversation = this.conversations[0];
          this.messages = this.conversations[conversations.length-1].messages;
          this.participants = this.conversation.participants;
          this.last_message = this.messages[this.messages.length - 1];

        }
      });
  }


  createConver() {
    this.conversationForm.value.participants = [this.conversationForm.value.participants, this.currentUser.id];
    this.conversationForm.value.messages = [{
      author: this.currentUser.firstName + ' ' + this.currentUser.lastName, text:this.conversationForm.value.text}]
    this.convesationSrv.createConversation(this.conversationForm.value)
      .pipe(first())
      .subscribe(
        error => {
        });
      this.getConversationsByUserId(this.currentUser.id);
  }

newMessage(message){
  for(let i = 0; i <message.length; i++) {
    this.variable = message[i].read;
    this.variable2 = message[i].author;
    this.name[0] = this.currentUser.firstName + ' ' + this.currentUser.lastName;

  if ((this.variable === false) && (this.variable2 != this.name)) {
    return true
    break
  }
}
  return false

}

  goMessages(id) {
    console.log('llega')
    //this.sharedService.changeMessages(this.conversation.messages)
    this.router.navigate(['messages'], {
      queryParams: { conver_p: id}
    });
    console.log(id, 'mensajes', this.conversation.messages)

  }

  deleteConver(id) {
    this.convesationSrv.deleteConver(this.currentUser.token, id)
      .pipe(first())
      .subscribe(
        
        error => {
          console.log(error)
        });
    this.getConversationsByUserId(this.currentUser.id);

  }






}