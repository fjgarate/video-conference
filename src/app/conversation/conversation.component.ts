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
  loading = false;
  submitted = false;
  isCollapsed: boolean = true;
  isCreated: boolean = false;

  messages: Message[] = [];
  users: User[] = [];
  pacientes: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
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

  toogleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }


  ngOnInit() {
      this.conversationForm = this.formBuilder.group({
        createUsername: this.currentUser.id,
        participants: '',
      });

      this.messageForm = this.formBuilder.group({
      text: [''],
      author: this.currentUser.id,
      read: false });
    //this.loadAllUsers();
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
        if (this.conversations.length > 0){
          this.messages = this.conversations[conversations.length-1].messages;
        }
      });
  }
  createConver(participant) {
    this.conversationForm.value.participants = [participant, this.currentUser.id];
    this.convesationSrv.createConversation(this.conversationForm.value)
      .pipe(first())
      .subscribe(
        data => {
        },
        error => {
        });
  }


  getConversationsById(id: string) {
    this.convesationSrv
      .getConversationsByUserId(this.currentUser.token, id)
      .pipe(first())
      .subscribe(conversations => {
        console.log(conversations);
        this.conversations = conversations;
        if (this.conversations.length > 0) {
          this.messages = this.conversations[conversations.length - 1].messages;
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


  private loadAllUsers() {
    this.userService
      .getAll(this.currentUser.token)
      .pipe(first())
      .subscribe(users => {
        console.log(users);
        this.users = users;
      });
    //this.openViduSrv.getSessions("https://138.4.10.65:4443", "gbttel");
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

  submitNewM(id: string) {
    this.submitted = true;
    this.loading = true;
    this.convesationSrv.addMessage(this.currentUser.token, id, this.messageForm.value)
      .pipe(first())
      .subscribe(
        data => {
        },
        error => {
          this.loading = false;
        });
    console.log('Hola caracola', this.messageForm);
    }


}


