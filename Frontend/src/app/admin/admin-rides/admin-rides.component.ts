import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RideService } from '../../core/services/ride.service';

@Component({
  selector: 'app-admin-rides',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './admin-rides.component.html',
  styleUrls: ['./admin-rides.component.css']

})
export class AdminRidesComponent implements OnInit {

  rides:any[]=[];
  filteredRides:any[]=[];
  drivers:any[]=[];
  selectedDriver:any={};

  loading=true;

  searchText="";
  statusFilter="";

  constructor(
    private http:HttpClient,
    private cdr:ChangeDetectorRef,
    private rideService:RideService
  ){}

  ngOnInit(){
    this.loadRides();
    this.loadDrivers();
  }

  loadRides(){

    this.http.get<any[]>("http://localhost:5000/api/admin/rides")
    .subscribe((data)=>{

      console.log("RIDES:",data);

      this.rides=data;
      this.filteredRides=data;

      this.loading=false;

      this.cdr.detectChanges();

    });

  }

  applyFilters(){

    this.filteredRides = this.rides.filter((ride:any)=>{

      const searchMatch =
      ride.pickup.toLowerCase().includes(this.searchText.toLowerCase()) ||
      ride.drop.toLowerCase().includes(this.searchText.toLowerCase());

      const statusMatch =
      !this.statusFilter || ride.status === this.statusFilter;

      return searchMatch && statusMatch;

    });

  }

  loadDrivers(){
    this.rideService.getDrivers().subscribe((data:any)=>{
      this.drivers=data;
    });
  }

  assignDriver(rideId:any){

    const driverId=this.selectedDriver[rideId];

    if(!driverId){
      alert("Select driver");
      return;
    }

    this.rideService.assignDriver(rideId,driverId)
    .subscribe(res=>{
      alert("Driver Assigned");
      this.loadRides();
    });
  }
  downloadInvoice(id:any){

window.open(`http://localhost:5000/api/admin/invoice/${id}`,"_blank");

}

}
