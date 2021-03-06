import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Appointment } from '../models/appointment';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class AppointmentService {
  constructor(private http: HttpClient) {}
  
  getAll(token: string, userId: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/appointments" + "/" + userId,
      options
    );
  }

  getToday(token: string, userId: string){
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/appointments/today" + "/" + userId,
      options
    );
  }
  
  getAllCalendar(token: string, userId: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/appointments/calendar" + "/" + userId,
      options
    );
  }  
  
  createEvent(newEvent: Appointment) {
    console.log('Evento creado');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      })
    };
    return this.http.post<any>(
    environment.api_url + '/appointments/register',
newEvent, options
    );
  }
}
