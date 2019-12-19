import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private http: HttpClient) { }

  getSessionsLastDays(token: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      })
    };
    return this.http.get<any>(
      environment.api_url + "/sessions/lastDays/10",
      options
    );
  }
}
