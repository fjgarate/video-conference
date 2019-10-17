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
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { OptionsInput } from '@fullcalendar/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('400ms ease-in', style({ transform: 'translateY(0%)', opacity: 0.1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0.5 }))
      ])
    ])
  ]
})



export class AppointmentComponent implements OnInit {
  options: OptionsInput;
  currentUser: User;
  currentUserSubscription: Subscription;
  eventPrueba: AppointmentCalendar;
  appon: User[] = [];
  isCollapsed: boolean = true;
  appointmentForm: FormGroup;
  types_appintment: any = ['Nurse Appointment', 'Blood Test', 'Doctors Appointment']
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;


  calendarPlugins = [dayGridPlugin]; // important!
  
  handleDateClick(arg) { // handler method
    alert(arg.dateStr);
  }

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  

  displayedColumns = ['title','type', 'date'];
  dataSource: MatTableDataSource<Appointment>;;
  selection: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  constructor(
    private appointmentService: AppointmentService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
   }

  ngOnInit() {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<User>(allowMultiSelect, initialSelection);
    this.dataSource = new MatTableDataSource();
    /* this.dataSource.data = this.sessionnSrv
       .getVirtualAppintment(this.currentUser.token, this.currentUser.username)*/
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.appointmentForm = this.formBuilder.group({
      userId: this.currentUser.id,
      type: ['', [Validators.required]],
      date: ['', [Validators.required]],

    });
    this.loadAllApointment();
  }

  private loadAllApointment(){
    this.appointmentService
      .getAll(this.currentUser.token, this.currentUser.id)
      .pipe(first())
      .subscribe(appointments => {
        console.log(appointments);
        this.dataSource.data = appointments;
      });

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }
  toogleCollapse() {
    this.isCollapsed = !this.isCollapsed;
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
  private createAppointment(){}
}
