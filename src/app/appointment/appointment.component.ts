import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AppointmentService} from '../shared/services/appointment.service';
import { UserService, AuthenticationService } from '../shared/services';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User } from '../shared/models';
import { Appointment} from '../shared/models/appointment';


@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  event: Appointment;

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
      .getAll(this.currentUser.token)
      .pipe(first())
      .subscribe(event => {
        console.log(event);
        this.event = event;
      });
  }
}
