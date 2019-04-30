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
        if (this.conversations.length > 0) {
          this.messages = this.conversations[conversations.length - 1].messages;
        }
      });
  }

}
