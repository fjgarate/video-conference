﻿import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(token: string) {
    //return this.http.get<User[]>(`https://login-videocall.herokuapp.com/users`);
    console.log('token');
    console.log(token);
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(
      environment.api_url + '/users',
      options
    );
  }
  getPatients(user: User) {
    //return this.http.get<User[]>(`https://login-videocall.herokuapp.com/users`);
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(
      environment.api_url + `/users/patients/${user.id}`,
      options
    );
  }
  getDoctors(user: User) {
    //return this.http.get<User[]>(`https://login-videocall.herokuapp.com/users`);
    console.log("getDoctors")
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(
      environment.api_url + `/users/doctors/${user.id}`,
      options
    );
  }

  getById(token: string, id: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(
      environment.api_url + '/users/' + id,
      options
    );
  }

  register(user: User) {
    console.log('register');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      })
    };
    return this.http.post<any>(
      environment.api_url + '/users/register',
      user, options
    );
  }


  //Estas no sirven
  /*getById(id: number) {
    return this.http.get(`http://localhost:4200/users/${id}`);
  }

  register(user: User) {
    return this.http.post(`http://localhost:4200/users/register`, user);
  }

  update(user: User) {
    return this.http.put(`http://localhost:4200/users/${user.id}`, user);
  }*/

  delete(id: number) {
    return this.http.delete(`http://localhost:4200/users/${id}`);
  }
}
