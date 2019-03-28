import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";

import { User } from "../shared/models";
import { UserService, AuthenticationService } from "../shared/services";
import { OpenViduService } from "../shared/services/open-vidu.service";
@Component({
  selector: "app-doctor",
  templateUrl: "./doctor.component.html",
  styleUrls: ["./doctor.component.css"]
})
export class DoctorComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];

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
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  deleteUser(id: number) {
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
  }
  private loadAllPatients() {

    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(users => {
        console.log(users)
        this.users = users;
      });
    //this.openViduSrv.getSessions("https://138.4.10.65:4443", "gbttel");
  }
}
