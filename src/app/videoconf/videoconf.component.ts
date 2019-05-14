import { Component, OnInit, OnDestroy, Input, ViewChild  } from '@angular/core';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User } from '../shared/models';
import { UserService, AuthenticationService } from '../shared/services';
import { OpenViduService } from '../shared/services/open-vidu.service';
import { DoctorComponent} from '../doctor/doctor.component';
import { RouterModule, Router } from "@angular/router";
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: "app-videoconf",
  templateUrl: "./videoconf.component.html"
})
export class VideoconfComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User;
  sessionprueba: [];
  variable: Object;
  variable2: Object;

  texto: string = "Conectar";
  esta: boolean = true;
  public sessionName: [];
  num: boolean = false;
  buttonDisabled: boolean = true;
  sessionId: string;
  sessionId2: string;
  value: boolean = true;


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
    this.loadSessionsPrueba();
   // this.loadAllPatients();
  }

public loadAllPatients() {
   /* this.openViduSrv
      .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
      .subscribe(response => {
        this.sessionprueba = response.content;})*/
    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(users => {
        this.users = users;
        return this.users;
    /* for (let i = 0; i < users.length ; i++ ){
       this.variable2= this.users[i];
       this.sessionId2= this.variable2["id"];
       console.log('idUser',this.sessionId2);

       for (let j = 0; j < this.sessionprueba.length; j++) {
         this.variable = this.sessionprueba[j];
         this.sessionId = this.variable["sessionId"]
         console.log('idSession', this.sessionId)
       {
      if (this.sessionId2=== this.sessionId){
        console.log('A work')
        this.buttonDisabled=false;
      } 
    }
  }
  }*/
      
      });
      
  }




  private loadSessionsPrueba() {
    this.openViduSrv
      .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
      .subscribe(response => {
        this.sessionprueba = response.content;

        console.log('Funciona', this.sessionprueba);

         if (response.numberOfElements === 0) {
              this.num = true;
      }
      /*for (let i=0; i< this.sessionprueba.length; i++){
        console.log('Array',this.sessionprueba[i])
        this.variable= this.sessionprueba[i];
          this.sessionId =  this.variable["sessionId"]
          console.log('Pureba', this.sessionId)
      }*/
this.loadAllPatients()
      });

  }

  
  public selectUser(user) {
    console.log(user);
    this.router.navigate(['videoconf'], {
      queryParams: { user_p: user }
    });
    this.sessionName = user;
  }

  isActive(id){
  for (let j = 0; j < this.sessionprueba.length; j++) {
    this.variable = this.sessionprueba[j];
    this.sessionId = this.variable["sessionId"]
    console.log('id prueba', this.sessionId)
  if (id === this.sessionId) {
      console.log('id',id)
          return false
          break
    }
    if (id != this.sessionId) {
      console.log('id', id)
      return true
    }
  }
    
}

}
