import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, UserService } from '../shared/services';
import { User } from '../shared/models';
import { Subscription } from 'rxjs';
import { ConversationService } from '../shared/services/conversation.service';
import { first } from 'rxjs/operators';
import { Conversation } from '../shared/models/conversation';
import { Message } from "../shared/models/message";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../shared/services/shared.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

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


  displayedColumns = ['from', 'otherName', 'title', 'createdDate', 'select'];
  dataSource: MatTableDataSource<Conversation>;;
  selection: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
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
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Conversation>(allowMultiSelect, initialSelection);

      this.conversationForm = this.formBuilder.group({
        createUserId: this.currentUser.id,
        createUsername: this.currentUser.username,
        createName: this.currentUser.firstName + ' ' + this.currentUser.lastName, 
        title: '',
        participants: [''],
        otherName:'',
        text:''
        
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
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = conversations;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
       
        console.log('datasource',this.dataSource.data)
        this.conversations =[];
        this.conversations=conversations
         console.log('conversations: '+conversations.length)
        for (let conv of conversations) {
          let participants = conv.participants;
          let otherUser
          console.log('conversacion: ' + conv.title)

          console.log('participants: ' + participants +' length: '+participants.length)
          /*for (const participant of participants) {
            console.log('participant: ' + participant)
            if (this.currentUser.id !== participant) {
             
              this.userService
                .getById(this.currentUser.token, participant)
                .pipe(first())
                .subscribe(pacientes => {
                  otherUser = pacientes.firstName + ' ' + pacientes.lastName;
                  conv.other_participant=otherUser
                  this.conversations.push(conv)
                });
            }
          }  */      
        }
        console.log('conversations',this.conversations);
      });
  }


  createConver() {
    this.conversationForm.value.participants = [this.conversationForm.value.participants, this.currentUser.id];
    
    this.userService
      .getById(this.currentUser.token, this.conversationForm.value.participants[0])
      .pipe(first())
      .subscribe(paciente => {
        const otherName = paciente.firstName + ' ' + paciente.lastName;
        this.conversationForm.value.otherName= otherName
        this.conversationForm.value.messages = [{
          author: this.currentUser.firstName + ' ' + this.currentUser.lastName, text: this.conversationForm.value.text
        }]
        this.convesationSrv.createConversation(this.conversationForm.value)
          .pipe(first())
          .subscribe(()=>{
            this.getConversationsByUserId(this.currentUser.id);
             console.log('conversaciones actualizadas; ' + this.conversations)
            },
            error => {
              console.log('ERROR CREATE CONVERSATION',error)
            });
        
      });





    
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
      .subscribe(error => {
          console.log(error)
        });

    this.getConversationsByUserId(this.currentUser.id);
    console.log('conversaciones actualizadas; '+this.conversations)
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }


  deleteConversations(){
    this.selection.selected.forEach(item => {
      this.convesationSrv.deleteConver(this.currentUser.token, item.id)
        .pipe(first())
        .subscribe(() => {
          let index: number = this.conversations.findIndex(d => d === item);
          console.log(this.conversations.findIndex(d => d === item));
          this.conversations.splice(index, 1)
          this.dataSource = new MatTableDataSource<Conversation>(this.conversations);
        },
          error => {
            console.log(error)
          })
    });
    this.selection = new SelectionModel<Conversation>(true, []);

    }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}