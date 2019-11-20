import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { MessagingService } from "./messaging.service";
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    message;
    constructor(
        private http: HttpClient,
        private msgService: MessagingService
        ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        console.log(environment.api_url)
        return this.http.post<any>(environment.api_url + '/users/authenticate', { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                user.id = user._id
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    console.log('login token; '+user.token)
                    this.currentUserSubject.next(user);
                    console.log("usuario: "+user.id);
                    console.log(this.currentUser);
                    this.msgService.requestPermission(user.id)
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
