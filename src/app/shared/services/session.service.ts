import { Injectable } from '@angular/core';
import { VirtualAppointment } from '../models/virtualAppointment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }
  register(session: VirtualAppointment) {
    console.log('register');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      })
    };
    return this.http.post<any>(
      environment.api_url + '/sessions/register',
      session, options
    );
  }
  getByDoctorId(token: string, id: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/sessions/doctor" + "/" + id,
      options
    );
  }
  getAll(token: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/sessions",
      options
    );
  }
}
