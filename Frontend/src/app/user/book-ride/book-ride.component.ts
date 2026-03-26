import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RideService } from '../../core/services/ride.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './book-ride.component.html',
  styleUrls: ['./book-ride.component.css']
})
export class BookRideComponent {

  pickup = '';
  drop = '';
  carType = 'Sedan';
  rideMood: string = 'Silent';
  loading = false;
  paymentMethod: string = '';


  constructor(
    private rideService: RideService,
    private router: Router
  ) {}
  bookRide() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user || !user._id) {
      alert("User not found. Please login again.");
      return;
    }
    if (!this.pickup || !this.drop || !this.paymentMethod) {
      alert("Please fill all required fields");
      return;
    }
    this.loading = true;

    this.rideService.bookRide({
      userId: user._id,
      pickup: this.pickup,
      drop: this.drop,
      carType: this.carType,
      rideMood: this.rideMood,
      paymentMethod: this.paymentMethod 
    }).subscribe({
      next: () => {
        alert("Ride booked successfully 🚗");
        this.loading = false;
        this.router.navigate(['/user/dashboard']);
      },
      error: () => {
        alert("Booking failed");
        this.loading = false;
      }
    });
  }
}
