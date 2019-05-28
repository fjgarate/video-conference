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


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  prueba: [];
  sessionprueba: [];
  data: string;
  public sessionName: [];
  conversations: Conversation[] = [];
  messages: Message[] = [];
  conversations2: Conversation[] = [];
  mes: Message[] = [];
  num: number;
  variable2: string;
  name: string;
  conver: Conversation;


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private openViduSrv: OpenViduService,
    private convesationSrv: ConversationService,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {
    this.getConversationsByUserId(this.currentUser.id);

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

        console.log('Prueba', this.conversations2);

        for (let i = 0; i < this.conversations.length; i++) {
          this.conver = this.conversations[i];
          this.mes = this.conver.messages;

          for (let j = 0; j < this.mes.length; j++) {
            this.variable2 = this.mes[j].author;
            this.name = this.currentUser.firstName + ' ' + this.currentUser.lastName;

            if ((this.mes[j].read === false) && (this.variable2 != this.name)) {
              count = count + 1;
              break

            }
          }

        };
        this.num = count;

      })

  }

}
