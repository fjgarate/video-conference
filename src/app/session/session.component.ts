import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionEventService } from '../shared/services/sessionEvent.service';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { first } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { VirtualAppointment } from '../shared/models/virtualAppointment';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionService } from '../shared/services/session.service';
@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  virtualAppintments: VirtualAppointment[] = [];
  displayedColumns = ['patient','startAt','endAt'];
  dataSource: MatTableDataSource<VirtualAppointment>;
  selection: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  constructor(
    private authenticationService: AuthenticationService,
    private sessionnService: SessionService,
  ) { 
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {
    console.log('llega al oninit')
    //this.loadAllVirtualAppointments();
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<VirtualAppointment>(allowMultiSelect, initialSelection);
    this.dataSource = new MatTableDataSource();
   /* this.dataSource.data = this.sessionnSrv
      .getVirtualAppintment(this.currentUser.token, this.currentUser.username)*/
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   this.loadAllSessions();
 

    console.log('virtualAppintments on init: ' + this.virtualAppintments)
  }
  private loadAllSessions(){
    this.sessionnService
      .getByDoctorId(this.currentUser.token,this.currentUser.id)
      .pipe(first())
      .subscribe(sessions => {
        console.log(sessions.length)
        console.log(sessions[0])
        this.dataSource.data = sessions;
      });
  }
  /*private loadAllVirtualAppointments() {
    let filter = new HttpParams().set('userId', this.currentUser.username).set('action', "connect")
    this.sessionnSrv
      .getByFilter(this.currentUser.token, filter)
      .pipe(first())
      .subscribe(sessionEvens => {
        for (let event of sessionEvens) {
          
          let susConnectionId = event.susConnectionId;
          let connectionId = event.connectionId;
          let starAt = event.time;
          console.log('startAt: '+starAt)
          console.log("doctor: " + this.currentUser.username)
          filter = new HttpParams().set('connectionId', susConnectionId).set('action', "connect")
          console.log('sessionEvens', event.connectionId);
          this.sessionnSrv
            .getByFilter(this.currentUser.token, filter)
            .pipe(first())
            .subscribe(sessionEvens => {

              if(sessionEvens.length > 0){
                let event = sessionEvens[0];
                let patient = event.userId;
                console.log("paciente: " + patient)
                filter = new HttpParams().set('userId', this.currentUser.username).set('connectionId', connectionId).set('susConnectionId', susConnectionId).set('action', "disconnect")
                this.sessionnSrv
                  .getByFilter(this.currentUser.token, filter)
                  .pipe(first())
                  .subscribe(sessionEvens => {
                    if (sessionEvens.length > 0) {
                      let event = sessionEvens[0];
                      console.log('endAt: '+event.time)
                     
                      let virtual=  new VirtualAppointment();
                      virtual.doctor = this.currentUser.username
                      virtual.patient = patient;
                      virtual.startAt = starAt;
                      virtual.endAt = event.time;
                      this.virtualAppintments.push(virtual)
                     
                    }

                    console.log('virtualAppintments: ' + this.virtualAppintments)
            
                  });
              }
            });
          
        }
      });
    
  }*/
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
  goToSession(ig:string){
    console.log('gotosession')
  }
}
