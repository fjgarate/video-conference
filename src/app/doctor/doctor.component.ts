import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../shared/models';
import { UserService, AuthenticationService } from '../shared/services';
import { OpenViduService } from '../shared/services/open-vidu.service';


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
  public prueba2$: Observable <any> = null;


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private openViduSrv: OpenViduService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {
    this.loadAllPatients();
   // this.loadAllConnectedP();
    // this.loadSessionsId();
    this.loadSessionsPrueba();

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  /*deleteUser(id: number) {
    this.userService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.loadAllUsers();
      });
  }

  private loadAllUsers() {

    this.userService
      .getAll(this.currentUser.token)
      .pipe(first())
      .subscribe(users => {
        console.log(users)
        this.users = users;
      });
    //this.openViduSrv.getSessions("https://138.4.10.65:4443", "gbttel");
  }*/


  private loadAllPatients() {
    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(users => {
        console.log(users);
        this.users = users;
      });
  }
  /*private loadAllConnectedP() {
    this.openViduSrv
      .getSessions('https://138.4.10.65:4443', 'gbttel')
      .then(response => { this.data = response;});
  }*/

  private loadSessionsPrueba() {
    this.openViduSrv
      .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
      .subscribe(response => {
        console.log('Funciona', response);
        this.sessionprueba = response;
      });
  }

  /*
  private loadSessionsId() {
    this.openViduSrv
    .getSessionsId('https://138.4.10.65:4443', 'gbttel', 'noe')
    .subscribe(response => {
      console.log('Funciona', response);
      this.prueba = response;
    });
  }*/
 

}
