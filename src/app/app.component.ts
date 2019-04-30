import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './shared/services';
import { User } from "./shared/models";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  currentUser: User;
  title = "OpenVidu-call";
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  get isDoctor() {
    return this.currentUser && this.currentUser.role === 'doctor';
  }
  get isPatient() {
    return this.currentUser && this.currentUser.role === 'patient';
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);

  }
}

