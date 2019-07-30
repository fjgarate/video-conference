import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services";
import { User } from "../../models";
import { Router } from '@angular/router';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
   
  }
  ngOnInit(): void {
     this.authenticationService.currentUser.subscribe(
       x => (this.currentUser = x)
     );
  }
  get isDoctor() {
    return this.currentUser && this.currentUser.role === "doctor";
  }
  get isPatient() {
    return this.currentUser && this.currentUser.role === "patient";
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate([""]);
  }
}