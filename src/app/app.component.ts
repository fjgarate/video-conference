import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './shared/services';
import { User } from "./shared/models";
import { MessagingService } from './shared/services/messaging.service';

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
    private msgService: MessagingService
  ) {
    
  }
  ngOnInit() {
    this.authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x
      }
      
    );
    this.msgService.receiveMessage()
    this.message = this.msgService.currentMessage
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

