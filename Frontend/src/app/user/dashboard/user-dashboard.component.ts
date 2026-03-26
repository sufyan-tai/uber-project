import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  user: any = null;
  rides: any[] = [];
  activeRide: any = null;

  totalRides = 0;
  pendingRides = 0;
  completedRides = 0;

  loading = true;

  private refreshInterval: any;

  selectedRide: any = null;
  ratingValue: number = 5;
  reviewText: string = '';
  
  @HostListener('document:click', ['$event'])
handleClickOutside(event: any) {
  const clickedInside = event.target.closest('.notification-wrapper');
  if (!clickedInside) {
    this.showNotifications = false;
  }
}

  notifications: string[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) return;

    this.user = JSON.parse(storedUser);
    if (!this.user?._id) return;

    this.loadDashboard();

    this.refreshInterval = setInterval(() => {
      this.loadDashboard();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadDashboard(): void {
    this.http
      .get<any[]>(`http://localhost:5000/api/rides/user-history/${this.user._id}`)
      .subscribe({
        next: (res) => {
          this.rides = res || [];

          this.totalRides = this.rides.length;
          this.pendingRides = this.rides.filter(r => r.status === 'pending').length;
          this.completedRides = this.rides.filter(r => r.status === 'completed').length;

          this.pendingRides = 
            this.rides.filter(r =>
              r.status === 'pending' ||
              r.status === 'accepted' ||
              r.status === 'on_the_way' ||
              r.status === 'started'
            ).length;
             this.activeRide =
          this.rides.find(r =>
            r.status === 'pending' ||
            r.status === 'accepted' ||
            r.status === 'on_the_way' ||
            r.status === 'started'
          ) || null;

          this.generateNotifications();

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  generateNotifications() {

    this.notifications = [];

    this.rides.forEach(ride => {

      if (ride.status === 'accepted') {
        this.notifications.push(
          `🚗 Driver accepted your ride from ${ride.pickup} to ${ride.drop}`
        );
      }
      if (ride.status === 'expired') {
  this.notifications.push(
    `⌛ Ride request expired: ${ride.pickup} → ${ride.drop}`
  );
}

      if (ride.status === 'completed') {
        this.notifications.push(
          `✅ Ride completed: ${ride.pickup} → ${ride.drop}`
        );
      }

      if (ride.paymentStatus === 'paid') {
        this.notifications.push(
          `💳 Payment successful for ₹${ride.fare}`
        );
      }

    });

    this.unreadCount = this.notifications.length;
  }

 toggleNotifications() {
  this.showNotifications = !this.showNotifications;

  if (this.showNotifications) {
    this.unreadCount = 0;
  }
}

  cancelRide(id: string): void {
    this.http
      .put(`http://localhost:5000/api/rides/cancel/${id}`, {})
      .subscribe(() => {
        this.loadDashboard();
      });
  }
  triggerSOS() {
  if (!this.activeRide) return;

  alert("🚨 Emergency Alert Sent!\nRide details shared.");

  console.log("SOS Triggered for ride:", this.activeRide);

  // Future improvement:
  //this.http.put(`/api/rides/sos/${this.activeRide._id}`, {}).subscribe();
}
  openRating(ride: any) {
    this.selectedRide = ride;
    this.ratingValue = 5;
    this.reviewText = '';
  }

  submitRating() {
  if (!this.selectedRide) return;

  console.log("Submitting rating:", this.ratingValue);

  this.http.put(
    `http://localhost:5000/api/rides/rate/${this.selectedRide._id}`,
    {
      rating: this.ratingValue,
      review: this.reviewText
    }
  ).subscribe({
    next: (res) => {
      console.log("Rating success:", res);
      alert("Rating submitted ⭐");
      this.selectedRide = null;
      this.loadDashboard();
    },
    error: (err) => {
      console.error("Rating error frontend:", err);
      alert("Rating failed. Check backend.");
    }
  });
}

  getStepStatus(step: string): boolean {
    if (!this.activeRide) return false;

    const status = this.activeRide.status;

    const flow = [
      'pending',
      'accepted',
      'on_the_way',
      'started',
      'completed'
    ];

    return flow.indexOf(status) >= flow.indexOf(step);
  }

  goToProfile() {
    this.router.navigate(['/user/profile']);
  }

  goToHistory() {
    this.router.navigate(['/user/history']);
  }

  goToRideDetails(id: string) {
    this.router.navigate(['/user/ride', id]);
  }
  goToAbout() {
  this.router.navigate(['/user/about']);
  }

  goToContact() {
  this.router.navigate(['/user/contact']);
  }

  logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/']);
    }
  }
}