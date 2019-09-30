import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user';
import { first } from 'rxjs/internal/operators/first';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthenticationService } from '../shared/services/authentication.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  pacientes: User[] = [];
  displayedColumns = ['firstName', 'lastName', 'userName', 'select'];
  dataSource: MatTableDataSource<User>;
  selection: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
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
    this.loadAllPatients();
  }
  private loadAllPatients() {
    this.userService
      .getPatients(this.currentUser)
      .pipe(first())
      .subscribe(pacientes => {
        console.log(pacientes);
        this.dataSource.data = pacientes;
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
  goTorRegister(){
    console.log('llega')
    //this.sharedService.changeMessages(this.conversation.messages)
    this.router.navigate(['register'], {
      queryParams: { doctorId: this.currentUser.id }
    });

  }

  deleteUsers(){

  }
  
}
