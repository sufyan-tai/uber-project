import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../driver.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.css']
})
export class DriverHistoryComponent implements OnInit {

  driverId: string = '';
  rides: any[] = [];
  filteredRides: any[] = [];
  searchText: string = '';
  selectedRide: any = null;   // ✅ ADDED

  constructor(private driverService: DriverService ,private router: Router) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;

    const user = JSON.parse(stored);
    this.driverId = user._id;

    this.driverService.getDriverHistory(this.driverId)
      .subscribe(res => {
        this.rides = res;
        this.filteredRides = res;
      });
  }

  applyFilter() {
    this.filteredRides = this.rides.filter(r =>
      r.pickup.toLowerCase().includes(this.searchText.toLowerCase()) ||
      r.drop.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectRide(ride: any) {        // ✅ ADDED
    this.selectedRide = ride;
  }

  closeDetails() {               // ✅ OPTIONAL (clean close)
    this.selectedRide = null;
  }
}