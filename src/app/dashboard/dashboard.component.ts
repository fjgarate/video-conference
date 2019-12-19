import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartsService } from '../shared/services/charts.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { User } from '../shared/models/user';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { first } from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUserSubscription: Subscription;
  currentUser: User;
  
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Consultas virtuales', lineTension: 0, },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartData2: ChartDataSets[] = [
    { data: [], label: 'Consultas virtuales', lineTension: 0, },
  ];
  public lineChartLabels2: Label[] = [];

  constructor(
    private chartsService: ChartsService,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {

    this.getSessionsLastDays();

  }

  getSessionsLastDays() {
    this.chartsService
      .getSessionsLastDays(this.currentUser.token)
      .pipe(first())
      .subscribe(data => {
        console.log('data: ' + data);

        let chart_data = [];
        let chart_label = [];
        for (let d of data) {
          console.log(d.numberofsessions);
          console.log(d._id);
          chart_data.push(d.numberofsessions);
          chart_label.push(d._id);
        }
        this.lineChartData[0].data = chart_data
        this.lineChartLabels = chart_label
      });
  }
  
}
