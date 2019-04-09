import { Component, OnInit, OnDestroy, Input, ViewChild  } from '@angular/core';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User } from '../shared/models';
import { UserService, AuthenticationService } from '../shared/services';
import { OpenViduService } from '../shared/services/open-vidu.service';
import { DoctorComponent} from '../doctor/doctor.component';

@Component({
  selector: 'app-videoconf',
  templateUrl: './videoconf.component.html',
})
export class VideoconfComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  sessionprueba: [];
  variable: [];
  texto: string = "Conectar";
  esta: boolean = true;
  public sessionName: [];



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
    this.loadSessionsPrueba();
  }

  cambiaEstado(variable1, variable2) {
    if (variable1.includes(variable2))
    {
      this.esta = true;
      console.log('Verdadero');
    } else {
      this.esta = false;
      console.log('Falso');

    }
  }

  getColor(varia1, varia2) {
    switch (this.texto) {
      case varia1.username.includes(varia2.sessionId):
        return 'green';}
        console.log('Cambia color')
  }

  private loadAllPatients() {
    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(users => {
        console.log(users);
        this.users = users;
      });
  }

  private loadSessionsPrueba() {
    this.openViduSrv
      .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
      .subscribe(response => {
        console.log('Funciona', response);
        this.sessionprueba = response;
      });
  }
  public selectUser(user) {
    console.log(user);
    this.sessionName = user;

  }

}
