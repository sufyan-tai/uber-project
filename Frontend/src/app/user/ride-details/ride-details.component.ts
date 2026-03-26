import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.css']
})
export class RideDetailsComponent implements OnInit {

  ride: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("Ride Deatls Component Loaded");

    const id = this.route.snapshot.paramMap.get('id');

    console.log("Ride ID:", id);

    this.http
      .get<any>(`http://localhost:5000/api/rides/${id}`)
      .subscribe({
        next: (res) => {
          this.ride = res.ride ?  res.ride : res;
          console.log("Ride Loaded:", this.ride);
           this.cd.detectChanges();
           
        },
        error: (err) => {
          console.error("Error loading ride:", err);
        }
        
      });
  }

  calculateTax() {
    return this.ride ? (this.ride.fare * 0.05).toFixed(2) : 0;
  }

  totalAmount() {
    return this.ride
      ? (this.ride.fare + this.ride.fare * 0.05).toFixed(2)
      : 0;
  }
  downloadInvoice() {

  if (!this.ride) return;

  const invoiceContent = `
  Uber Booking Invoice
  ----------------------------
  Ride ID: ${this.ride._id}
  Date: ${new Date(this.ride.createdAt).toLocaleString()}
  Pickup: ${this.ride.pickup}
  Drop: ${this.ride.drop}
  Fare: ₹${this.ride.fare}
  Payment: ${this.ride.paymentMethod}
  Status: ${this.ride.status}
  `;

  const blob = new Blob([invoiceContent], { type: 'text/plain' });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `invoice_${this.ride._id}.txt`;
  link.click();
}
}