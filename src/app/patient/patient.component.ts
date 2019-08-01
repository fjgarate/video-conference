import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../shared/models';
import { UserService, AuthenticationService } from '../shared/services';
import { OpenViduService } from '../shared/services/open-vidu.service';
import { Conversation } from '../shared/models/conversation';
import { Message } from '../shared/models/message';
import { ConversationService } from '../shared/services/conversation.service';
import { AppointmentService } from '../shared/services/appointment.service';
import { Appointment } from '../shared/models/appointment';
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  sessionprueba: [];
  sessionName: [];
  conversations: Conversation[] = [];
  conver: Conversation;
  mes: Message[] = [];
  num: number;
  events: Appointment[];
  nextEvent: Appointment[] = [];
  date = new Date();
  name: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private openViduSrv: OpenViduService,
    private convesationSrv: ConversationService,
    private appointmentService: AppointmentService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {
    // this.loadAllPatients();
    this.loadAllEvents();
    // this.loadSessions();
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

  private loadSessions() {
    this.openViduSrv
      .getSessionsPrueba(environment.openvidu_url, environment.openvidu_secret)
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

        let count = 0;

        for (let i = 0; i < this.conversations.length; i++) {
          this.conver = this.conversations[i];
          this.mes = this.conver.messages;

          for (let j = 0; j < this.mes.length; j++) {
            let author = this.mes[j].author;
            this.name =
              this.currentUser.firstName + " " + this.currentUser.lastName;

            if (this.mes[j].read === false && author != this.name) {
              count = count + 1;
              break;
            }
          }
        }
        this.num = count;
      });
  }

  private loadAllEvents() {
    this.appointmentService
      .getToday(this.currentUser.token, this.currentUser.id)
      .pipe(first())
      .subscribe(events => {
        this.events = events;
        for (var _i = 0; _i < this.events.length && _i < 5; _i++) {
          this.date = this.events[_i].date;
          this.nextEvent[_i] = this.events[_i];
        }
      });
  }
}
