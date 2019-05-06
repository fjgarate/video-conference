import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;


  calendarPlugins = [dayGridPlugin]; // important!
  
  handleDateClick(arg) { // handler method
    alert(arg.dateStr);
  }

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }


  constructor() { }

  ngOnInit() {
   
  }

}
