import { read } from 'fs';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../shared/models';
import { UserService, AuthenticationService} from '../shared/services';
import { OpenViduService } from '../shared/services/open-vidu.service';
import { Conversation } from '../shared/models/conversation';
import { Message } from '../shared/models/message';
import { ConversationService } from '../shared/services/conversation.service';
import { MessagesComponent } from '../messages/messages.component';
import { AppointmentService } from '../shared/services/appointment.service';
import { Appointment } from '../shared/models/appointment';


@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  prueba: [];
  sessionprueba: [];
  data: string;
  public sessionName: [];
  conversations: Conversation[] = [];
  conver: Conversation;
  conversations2: Conversation[] = [];
  messages: Message[] = [];
  noread: Message[] = [];
  mes: Message[] = [];
  num: number;
  event: Appointment;
  nextEvent: Appointment[]=[];
  event2: Appointment[] =[]
  date = new Date();
  event3: Appointment[] = []
date2 = new Date();
  variable2: string;
  name: string;


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private openViduSrv: OpenViduService,
    private convesationSrv: ConversationService,
    private appointmentService: AppointmentService,


  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {
    this.loadAllPatients();
    this.loadAllEvents();
    this.loadSessionsPrueba();
    this.getConversationsByUserId(this.currentUser.id);

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }


  public selectUser(user) {
    this.sessionName = user;

  }

  private loadAllPatients() {
    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(users => {
        this.users = users;
      });
  }


  private loadSessionsPrueba() {
    this.openViduSrv
      .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
      .subscribe(response => {
        this.sessionprueba = response;
      });
  }

 
  private getConversationsByUserId(id: string) {
    this.convesationSrv
      .getConversationsByUserId(this.currentUser.token, id)
      .pipe(first())
      .subscribe(conversations => {
        console.log(conversations);
        this.conversations = conversations;
        this.conversations2 = conversations;
        let count = 0;


        for (let i = 0; i < this.conversations.length; i++) {
          this.conver = this.conversations[i];
          this.mes = this.conver.messages;
         
          for (let j = 0; j< this.mes.length; j++){
          this.variable2 = this.mes[j].author;
          this.name = this.currentUser.firstName + ' ' + this.currentUser.lastName;
           
          if ((this.mes[j].read === false) && (this.variable2 != this.name))
          {
            count= count+1;
            break
            
          }
        }

      };
      this.num = count;
    
  })

}



  private loadAllEvents() {
    this.appointmentService
      .getToday(this.currentUser.token, this.currentUser.id)
      .pipe(first())
      .subscribe(event => {
        this.event = event;
        for (let i=0; i <5; i++){
        this.date2 = this.event[i].date;
        this.nextEvent[i] = this.event[i];
        }
      });
  }


}
