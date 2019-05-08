import { Component, OnInit, OnDestroy, Input, ViewChild  } from '@angular/core';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User } from '../shared/models';
import { UserService, AuthenticationService } from '../shared/services';
import { OpenViduService } from '../shared/services/open-vidu.service';
import { DoctorComponent} from '../doctor/doctor.component';
import { RouterModule, Router } from "@angular/router";

@Component({
  selector: "app-videoconf",
  templateUrl: "./videoconf.component.html"
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
  num: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private openViduSrv: OpenViduService,
    private router: Router
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


  private loadSessionsPrueba() {
    this.openViduSrv
      .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
      .subscribe(response => {
        console.log('Funciona', response);
        this.sessionprueba = response;
        if (response.numberOfElements === 0) {
              this.num = true;
      }
      console.log('N', this.num)
      });

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




  public selectUser(user) {
    console.log(user);
    this.router.navigate(['videoconf'], {
      queryParams: { user_p: user }
    });
    this.sessionName = user;
  }
}
