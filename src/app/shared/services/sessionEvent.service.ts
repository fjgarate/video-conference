import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { SessionEvent } from '../models/sessionEvent';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionEventService {

  constructor(private http: HttpClient) { }
/*
  create,
  getAll,
  getById,
  delete: _delete
*/
  getAll(token: string) {
    //return this.http.get<User[]>(`https://login-videocall.herokuapp.com/users`);
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(
      environment.api_url + '/sessions',
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
      environment.api_url + '/sessionEvents/' + id,
      options
    );
  }
  getByUserId(token: string, id: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/sessionEvents/user" + "/" + id,
      options
    );
  }
  getByFilter(token: string, filter: HttpParams) {
    console.log('filter de ida: '+filter)
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      params: filter
      
    };
    return this.http.get<any>(
      environment.api_url + "/sessionEvents/event/filter",
      options
    );
  }
  register(sessionEvent: SessionEvent) {
    console.log('register');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      })
    };
    return this.http.post<any>(
      environment.api_url + '/sessionEvents/register',
      sessionEvent, options
    );
  }
  delete(token: string, id: string) {
    console.log('Eliminada')
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.delete<any>(
      environment.api_url + '/sessionEvents/' + id,
      options
    );
  }
  /*getVirtualAppintment(token: string, username: string) {
    let virtualAppintments: VirtualAppointment[] = []; 
    let filter = new HttpParams().set('userId', username).set('action', "connect")
    this.getByFilter(token, filter)
      .pipe(first())
      .subscribe(sessionEvens => {
        for (let event of sessionEvens) {

          let susConnectionId = event.susConnectionId;
          let connectionId = event.connectionId;
          let starAt = event.time;
          console.log('startAt: ' + starAt)
          console.log("doctor: " + username)
          filter = new HttpParams().set('connectionId', susConnectionId).set('action', "connect")
          console.log('sessionEvens', event.connectionId);
          this
            .getByFilter(token, filter)
            .pipe(first())
            .subscribe(sessionEvens => {

              if (sessionEvens.length > 0) {
                let event = sessionEvens[0];
                let patient = event.userId;
                console.log("paciente: " + patient)
                filter = new HttpParams().set('userId',username).set('connectionId', connectionId).set('susConnectionId', susConnectionId).set('action', "disconnect")
                this
                  .getByFilter(token, filter)
                  .pipe(first())
                  .subscribe(sessionEvens => {
                    if (sessionEvens.length > 0) {
                      let event = sessionEvens[0];
                      console.log('endAt: ' + event.time)

                      let virtual = new VirtualAppointment();
                      virtual.doctor = username
                      virtual.patient = patient;
                      virtual.startAt = starAt;
                      virtual.endAt = event.time;
                      virtualAppintments.push(virtual)

                    }

                    console.log('virtualAppintments: ' +virtualAppintments)

                  });
              }
            });

        }
      });
return virtualAppintments;
   }*/
}



