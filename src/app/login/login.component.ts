import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../shared/services';

@Component(
  {templateUrl: './login.component.html'}
  )
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                console.log(data.role);
                let role = data.role;
                if (role == 'doctor'){
                  this.router.navigate(['/doctor']);
                } else{
                  this.router.navigate(['/patient']);
                }
                // const roomName = this.loginForm.value.username.replace(/ /g, "-"); // replace white spaces by -
                //this.router.navigate(['']);
                //this.router.navigate(["/", roomName]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
/*
  public goToVideoCall() {
    console.log('lleha')
    if (this.loginForm.valid) {
      const roomName = this.loginForm.value.username.replace(/ /g, "-"); // replace white spaces by -
      this.router.navigate(["/", roomName]);
    }
  }*/
}
