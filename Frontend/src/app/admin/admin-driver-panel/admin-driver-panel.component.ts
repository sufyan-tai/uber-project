import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Route } from '@angular/router';    

@Component({
selector:'app-admin-driver-panel',
standalone:true,
imports:[CommonModule,HttpClientModule,RouterModule],
templateUrl:'./admin-driver-panel.component.html',
styleUrls:['./admin-driver-panel.component.css']
})
export class AdminDriverPanelComponent implements OnInit{

driverId:any;
driver:any;
rides:any[]=[];
loading=true;
stats:any = {
    totalRides:0,
    completed:0,
    cancelled:0,
    earnings:0
};

constructor(
private route:ActivatedRoute,
private http:HttpClient,
private cdr:ChangeDetectorRef
){}

ngOnInit(){

this.route.paramMap.subscribe(params=>{

this.driverId = params.get('id');
if (this.driverId){
this.loadDriver();
this.loadDriverRides();
this.loadDriverStats();
}
});

}

loadDriver(){

this.http.get(`http://localhost:5000/api/admin/driver/${this.driverId}`)
.subscribe((data:any)=>{
this.driver=data;
});

}

loadDriverRides(){

this.loading = true;

this.http.get(`http://localhost:5000/api/admin/driver-rides/${this.driverId}`)
.subscribe((data:any)=>{

console.log("Driver rides:",data);

this.rides=data;
this.loading=false;
this.cdr.detectChanges();

});

}
loadDriverStats(){

this.http.get(`http://localhost:5000/api/admin/driver-stats/${this.driverId}`)
.subscribe((data:any)=>{

console.log("Driver stats API:", data);

this.stats = {
totalRides:data.totalRides,
completed:data.completed,
cancelled:data.cancelled,
earnings:data.earnings
};
    this.cdr.detectChanges();
});

}

}