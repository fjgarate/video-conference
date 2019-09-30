import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '../shared/services';
import { User } from '../shared/models';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    roleName = '';
    doctors: User[] = [];
    admin: User[] = [];
    currentUserSubscription: Subscription;
    currentUser: User;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
     /*   if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }*/
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
            user => {
                this.currentUser = user;
            }
        );

    }

    ngOnInit() {

        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            dni: ['', Validators.required],
            role: [''],
            doctorIds: ['']
        });
      
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        console.log('llega submit')
        this.submitted = true;
        this.registerForm.value.role = 'patient'
        this.registerForm.value.doctorIds = this.currentUser.id
        console.log(this.registerForm.value)
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
       
    
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/patients']);
                },
                error => {
                    console.log(error)
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    asignarDoctor(): boolean {
        if (this.registerForm.value.role === 'patient') {console.log('Paciente')
            return true;
    } else {
        return false; }
    }

}
