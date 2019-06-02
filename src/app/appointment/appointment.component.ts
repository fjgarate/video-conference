import { AppointmentCalendar } from './../shared/models/appointmentCalendar';
import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AppointmentService} from '../shared/services/appointment.service';
import { UserService, AuthenticationService } from '../shared/services';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User } from '../shared/models';
import { Appointment} from '../shared/models/appointment';

import { OptionsInput } from '@fullcalendar/core';


@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  options: OptionsInput;
  currentUser: User;
  currentUserSubscription: Subscription;
  eventPrueba: AppointmentCalendar;

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;


  calendarPlugins = [dayGridPlugin]; // important!
  
  handleDateClick(arg) { // handler method
    alert(arg.dateStr);
  }

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  


  constructor(
    private appointmentService: AppointmentService,
    private authenticationService: AuthenticationService,
    private userService: UserService,

  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
   }

  ngOnInit(
   
  ) {
    this.loadAllEvents();
  }


  private loadAllEvents() {
    this.appointmentService
      .getAllCalendar(this.currentUser.token, this.currentUser.id)
      .pipe(first())
      .subscribe(eventPrueba => {
        console.log(eventPrueba);
        this.eventPrueba = eventPrueba;
        console.log(this.eventPrueba)
      });
  }
}
