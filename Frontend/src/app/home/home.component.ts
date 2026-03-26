import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
selector:'app-home',
standalone:true,
imports:[CommonModule,RouterModule,FormsModule],
templateUrl:'./home.component.html',
styleUrls:['./home.component.css']
})
export class HomeComponent{

pickup="";
drop="";
 constructor(private router: Router) {}

bookRide() {

  if (!this.pickup || !this.drop) {
    alert("Please enter pickup and drop location");
    return;
  }

  localStorage.setItem('rideData', JSON.stringify({
    pickup: this.pickup,
    drop: this.drop
  }));

  
  this.router.navigate(['/user/book']);
}
}
