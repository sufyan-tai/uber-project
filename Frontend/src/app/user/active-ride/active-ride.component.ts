import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-ride.component.html',
  styleUrls: ['./active-ride.component.css']
})
export class ActiveRideComponent implements OnInit {

  ride: any;
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadActiveRide();
  }

  loadActiveRide() {
    this.http
      .get<any>(`http://localhost:5000/api/user/active/${this.user._id}`)
      .subscribe(res => this.ride = res);
  }
  cancelRide(id: string) {
  this.http
    .put(`http://localhost:5000/api/user/cancel/${id}`, {})
    .subscribe(() => this.loadActiveRide());
}

}
