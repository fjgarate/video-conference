import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { first } from 'rxjs/internal/operators/first';
import { User } from '../../models/user';
import { VirtualAppointment } from '../../models/virtualAppointment';
@Component({
  selector: 'app-table-sessions',
  templateUrl: './table-sessions.component.html',
  styleUrls: ['./table-sessions.component.css']
})
export class TableSessionsComponent implements OnInit {
  @Input() currentUser: User;
  displayedColumns = ['doctor','patient', 'startAt', 'duration'];
  dataSource: MatTableDataSource<VirtualAppointment>;
  selection: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<VirtualAppointment>(allowMultiSelect, initialSelection);
    this.dataSource = new MatTableDataSource();
    /* this.dataSource.data = this.sessionnSrv
       .getVirtualAppintment(this.currentUser.token, this.currentUser.username)*/
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  
    this.loadAllSessions();
  }
  private loadAllSessions() {
    this.sessionService
      .getAll(this.currentUser.token)
      .pipe(first())
      .subscribe(sessions => {
        this.dataSource.data = sessions;
        console.log(sessions.length)
        console.log(sessions[0])
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
}
