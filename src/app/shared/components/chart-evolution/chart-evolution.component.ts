import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';
import { ChartsService } from '../../services/charts.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from '../../models';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-chart-evolution',
  templateUrl: './chart-evolution.component.html',
  styleUrls: ['./chart-evolution.component.css']
})
export class ChartEvolutionComponent implements OnInit {
  currentUserSubscription: Subscription;
  currentUser: User;
  @Input() lineChartData: ChartDataSets;
  @Input() lineChartLabels: Label;

  
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#607d8b',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

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
  // this.getSessionsLastDays();
  
  }
  getSessionsLastDays() {
    this.chartsService
      .getSessionsLastDays(this.currentUser.token)
      .pipe(first())
      .subscribe(data => {
        console.log('data: '+data);
      
        let chart_data = [];
        let chart_label = [];
        for (let d of data){
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
