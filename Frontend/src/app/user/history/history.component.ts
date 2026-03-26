import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  rides: any[] = [];
  filteredRides: any[] = [];
  rateRide(ride: any) {
  this.router.navigate(['/user/ride', ride._id]);
}

  selectedRide: any = null;
  user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  searchText: string = '';
  selectedStatus: string = '';
  selectedDate: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadRides();
  }

  loadRides() {
    if (!this.user._id) return;

    this.http
      .get<any[]>(`http://localhost:5000/api/rides/user-history/${this.user._id}`)
      .subscribe(res => {
        this.rides = res || [];
        this.filteredRides = [...this.rides];
      });
  }

  applyFilters() {

    this.filteredRides = this.rides.filter(ride => {

      const matchesSearch =
        !this.searchText ||
        ride.pickup.toLowerCase().includes(this.searchText.toLowerCase()) ||
        ride.drop.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        !this.selectedStatus ||
        ride.status === this.selectedStatus;

      const matchesDate =
        !this.selectedDate ||
        ride.createdAt?.startsWith(this.selectedDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedDate = '';
    this.filteredRides = [...this.rides];
  }

  openRide(id: string) {
    this.router.navigate(['/user/ride', id]);
  }
}