import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule,BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  stats:any = {
    users:0,
    drivers:0,
    rides:0,
    completed:0,
    cancelled:0,
    pending:0,
    active:0,
    expired:0
  };

  loading = true;

  constructor(private http:HttpClient, private cdr:ChangeDetectorRef){}
  // chart type
public chartType: ChartType = 'bar';

// chart labels 
public chartLabels: string[] = [
  'Mon','Tue','Wed','Thu','Fri','Sat','Sun'
];

// chart data
public chartData: ChartConfiguration['data'] = {
  labels: this.chartLabels,
  datasets: [
    {
      label: 'Completed Rides',
      data: [10, 12, 8, 15, 9, 11, 14]
    },
    {
      label: 'Cancelled Rides',
      data: [2, 1, 3, 2, 1, 4, 2]
    }
  ]
};

// chart options
public chartOptions: ChartConfiguration['options'] = {
  responsive: true
};

  ngOnInit(){

    console.log("Dashboard loading...");

    this.http.get("http://localhost:5000/api/admin/dashboard")
    .subscribe({
      next:(data:any)=>{
        console.log("Dashboard data:",data);
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.log("Dashboard error",err);
        this.loading = false;
      }
    });
  }
  logout(){
  localStorage.clear();
  window.location.href = "/login";
}
}