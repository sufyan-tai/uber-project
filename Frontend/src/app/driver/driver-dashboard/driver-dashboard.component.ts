import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../driver.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {

  driverId: string = '';
  pendingRides: any[] = [];
  activeRide: any = null;
  stats: any = {};
  isOnline: boolean = false;
  lastRideId: string | null = null;
  performance:any = {
  avgRating:0,
  totalDistance:0,
  cashRides:0,
  onlineRides:0
};
  showRideAlert: boolean = false;
  audio = new Audio('/sound.mp3');
  countdown: number = 15;
  timer: any;
  showRejectBox = false;
  rejectReason = '';
  rejectRideId = '';
  notifications:string[]=[];
  unreadCount=0;
  showNotifications:boolean=false;


  constructor(
    private driverService: DriverService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    if (user.role !== 'driver') return;

    this.driverId = user._id;
     this.isOnline = user.isOnline || false;
      this.audio.load();  // preload  sound k liye  
      setInterval(() => {
  this.loadData();
}, 5000);
    this.loadData();
    
  }
  

  loadData() {
    this.driverService.getPendingRides(this.driverId).subscribe(data => {
  if (data.length > 0) {

    const newestRide = data[0];

    if (!this.lastRideId || newestRide._id !== this.lastRideId) {
      this.showRideAlert = true;


       this.startTimer();
      this.audio.currentTime = 0;
      this.audio.play().catch(err => console.log("Audio blocked", err));


      const audio = new Audio('/sound.mp3');
    

        setTimeout(() => {
        audio.play().catch(err => console.log('Audio blocked', err));
      }, 100);
      }

    this.lastRideId = newestRide._id;
  }

  this.pendingRides = [...data];
  this.cdr.detectChanges();

});

    this.driverService.getActiveRide(this.driverId).subscribe(data => {
      this.activeRide = data;
      this.cdr.detectChanges();
    });

    this.driverService.getDashboard(this.driverId).subscribe(data => {
      this.stats = data;
      this.cdr.detectChanges();
    });
    this.driverService.getDriverHistory(this.driverId).subscribe((rides:any)=>{

if(!rides) return;

const completed = rides.filter((r:any)=>r.status === 'completed');

let ratingSum = 0;
let ratingCount = 0;

let distance = 0;
let cash = 0;
let online = 0;

completed.forEach((ride:any)=>{

if(ride.rating){
ratingSum += ride.rating;
ratingCount++;
}

distance += ride.distance || 0;

if(ride.paymentMethod === "Cash") cash++;
else online++;

});

this.performance.avgRating =
ratingCount ? (ratingSum/ratingCount).toFixed(1) : "N/A";

this.performance.totalDistance = distance;

this.performance.cashRides = cash;

this.performance.onlineRides = online;

});
  this.generateNotifications();
  }
  generateNotifications(){

this.notifications=[]

this.pendingRides.forEach(r=>{

this.notifications.push(
`🚗 New ride request from ${r.pickup} → ${r.drop}`
)

})

if(this.activeRide?.status==="cancelled"){

this.notifications.push("❌ Ride cancelled by passenger")

}

if(this.activeRide?.status==="completed"){

this.notifications.push("💰 Payment received")

}

this.unreadCount=this.notifications.length

}
  startTimer() {

  this.countdown = 15;

  clearInterval(this.timer);
  this.timer = setInterval(() => {
    this.countdown--;
    if (this.countdown <= 0) {
      clearInterval(this.timer);

      this.showRideAlert = false;
       if (this.pendingRides.length > 0) {

        const rideId = this.pendingRides[0]._id;

        this.driverService.expireRide(rideId).subscribe(() => {
          console.log("Ride expired automatically");
          this.lastRideId = null;  
          this.loadData();
        });

      }

    }

  }, 1000);

}
cancelRide(rideId: string) {

  const reason = prompt(
    "Cancel Reason:\n1. Traffic\n2. Vehicle Issue\n3. Other"
  );

  if (!reason) return;

  this.driverService.cancelRide(rideId, reason).subscribe(() => {

    alert("Ride Cancelled");

    this.loadData();

  });

}
  accept(rideId: string) {
    clearInterval(this.timer);
    this.showRideAlert=false;
    this.driverService.acceptRide(rideId, this.driverId).subscribe(() => {
      this.loadData();
    });
  }

  start(rideId: string) {
    this.driverService.startRide(rideId).subscribe(() => {
      this.loadData();
    });
  }

  complete(rideId: string) {
    this.driverService.completeRide(rideId).subscribe(() => {
      this.loadData();
    });
  }
  rejectRide(rideId: string) {

  clearInterval(this.timer);

  this.driverService.expireRide(rideId).subscribe(() => {

    this.showRideAlert = false;

    this.loadData();

  });

}
  toggleStatus() {
  this.driverService.toggleStatus(this.driverId).subscribe((res: any) => {
    
    this.isOnline = res.isOnline;

    
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.isOnline = this.isOnline;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

    this.loadData(); 
  });
}
onTheWay(rideId: string) {
  this.driverService.onTheWay(rideId).subscribe(() => {
    this.loadData();
  });
}
  logout() {
     this.driverService.setOffline(this.driverId).subscribe(() => {
  localStorage.clear();
  window.location.href = '/login';
});
}
openRejectPopup() {

  this.rejectRideId = this.pendingRides[0]._id;
  this.showRejectBox = true;

}

confirmReject() {

  if (!this.rejectReason) {
    alert("Please select reason");
    return;
  }

  clearInterval(this.timer);

  this.driverService
    .cancelRide(this.rejectRideId, this.rejectReason)
    .subscribe(() => {

      this.showRejectBox = false;
      this.showRideAlert = false;
      this.rejectReason = '';

      this.loadData();

    });
}
toggleNotifications(){

this.showNotifications=!this.showNotifications

if(this.showNotifications){
this.unreadCount=0
}

}
}

