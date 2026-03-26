import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../driver.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-driver-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-analytics.component.html',
  styleUrls: ['./driver-analytics.component.css']
})
export class DriverAnalyticsComponent implements OnInit {

  weekTotal: number = 0;
  monthTotal: number = 0;
  totalRides: number = 0;

  chart: any;

  constructor(private driverService: DriverService,private router: Router) {}
  goBack() {
  this.router.navigate(['/driver']);
}

  ngOnInit(): void {

    const stored = localStorage.getItem('currentUser');
    if (!stored) return;

    const driver = JSON.parse(stored);

    this.driverService.getDriverHistory(driver._id)
      .subscribe((rides: any[]) => {

        if (!rides || rides.length === 0) return;

        this.weekTotal = 0;
        this.monthTotal = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const last7Days = new Date();
        last7Days.setDate(now.getDate() - 7);

        const monthlyData: any = {};

        rides.forEach(ride => {

          const rideDate = new Date(ride.createdAt);
          const rideMonth = rideDate.getMonth();
          const rideYear = rideDate.getFullYear();

          const monthLabel = rideDate.toLocaleString('default', { month: 'short' });

          if (!monthlyData[monthLabel]) monthlyData[monthLabel] = 0;
          monthlyData[monthLabel] += ride.fare;

          if (rideMonth === currentMonth && rideYear === currentYear) {
            this.monthTotal += ride.fare;
          }

          if (rideDate >= last7Days) {
            this.weekTotal += ride.fare;
          }

        });

        this.totalRides = rides.length;

        this.renderChart(monthlyData);

      });
  }

  renderChart(monthlyData: any) {

    const labels = Object.keys(monthlyData);
    const data = Object.values(monthlyData);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('earningsChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Earnings ₹',
          data: data,
          backgroundColor: '#22c55e',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
         maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        },
        
        scales: {
          x: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }
}