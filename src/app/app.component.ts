import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './shared/services';
import { User } from "./shared/models";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit{
  currentUser: User;
  title = "Video Call";
  message;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    
  }
  ngOnInit() {
    this.authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x
      }
      
    );
    
  }
  get isDoctor() {
    return this.currentUser && this.currentUser.role === 'clinical';
  }
  get isPatient() {
    return this.currentUser && this.currentUser.role === 'patient';
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);

  }
}

