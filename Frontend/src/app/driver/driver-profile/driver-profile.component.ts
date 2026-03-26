import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../driver.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-driver-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnInit {

  driver: any = null;
  ratings: any = null;
  earnings: any = null;
  loading: boolean = true;

  constructor(
    private driverService: DriverService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const stored = localStorage.getItem('currentUser');
    if (!stored) return;

    this.driver = JSON.parse(stored);

    if (!this.driver?._id) return;

    this.driverService.getRatings(this.driver._id)
      .subscribe(res => {
        this.ratings = res;
        this.cdr.detectChanges();   
      });

    
    this.driverService.getDashboard(this.driver._id)
      .subscribe((res: any) => {
        this.earnings = res;
        this.loading = false;
        this.cdr.detectChanges();   
      });
  }
}