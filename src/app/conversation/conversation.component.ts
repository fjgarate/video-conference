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
  cambio: FormGroup;
  loading = false;
  submitted = false;
  isCollapsed: boolean = true;
  isCreated: boolean = false;
  participants: string[] = [];
  conversation: Conversation;
  last_message: Message;
  user_conversation: User;


  messages: Message[] = [];
  users: User[] = [];
  pacientes: User[] = [];

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

  toogleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }


  ngOnInit() {
      this.conversationForm = this.formBuilder.group({
        createUsername: this.currentUser.id,
        title: [''],
        participants: [''],
        messages: [
          {
            author: this.currentUser.firstName + ' ' + this.currentUser.lastName,
            text: 'La conversación ha sido creada con éxito',
          }
        ]
      });

      this.messageForm = this.formBuilder.group({
      text: [''],
      author: this.currentUser.firstName + ' ' + this.currentUser.lastName,
      read: false });

      this.cambio = this.formBuilder.group({
        role: true
      });
    this.loadAllPatients();
    this.getConversationsByUserId(this.currentUser.id);
  }

  get f() { return this.messageForm.controls; }


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
    this.convesationSrv.createConversation(this.conversationForm.value)
      .pipe(first())
      .subscribe(
        data => {this.conversations = data;
        },
        error => {
        });
        this.getConversationsByUserId(this.currentUser.id);
  }


  getConversationsById(id: string) {
    this.convesationSrv
      .getConversationsByUserId(this.currentUser.token, id)
      .pipe(first())
      .subscribe(conversations => {
        console.log('Conversaciones',conversations);
        this.conversations = conversations;
        if (this.conversations.length > 0) {
          this.messages = this.conversations[conversations.length - 1].messages;
        }
      });
      this.router.navigate(['messages'], {
        queryParams: {conver_p: this.conversations}
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


  getById(id: string) {
    this.userService
      .getById(this.currentUser.token, id)
      .pipe(first())
      .subscribe(pacientes => {
        console.log('Pacientes', pacientes);
        this.pacientes = pacientes;
      });
  }



  goMessages(id) {
    console.log('llega')
    this.sharedService.changeMessages(this.conversation.messages)
    this.router.navigate(['messages'], {
      queryParams: { conver_p: id}
    });
    console.log(id)


  }



}