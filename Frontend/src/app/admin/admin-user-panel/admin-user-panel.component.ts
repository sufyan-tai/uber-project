import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
selector:'app-admin-user-panel',
standalone:true,
imports:[CommonModule,HttpClientModule,RouterModule],
templateUrl:'./admin-user-panel.component.html',
styleUrls:['./admin-user-panel.component.css']
})
export class AdminUserPanelComponent implements OnInit{

userId:any;
user:any;
rides:any[]=[];

stats={
total:0,
completed:0,
cancelled:0
};

constructor(
private route:ActivatedRoute,
private http:HttpClient,
private cdr:ChangeDetectorRef
){}
ngOnInit(){

this.userId=this.route.snapshot.paramMap.get('id');

this.loadUser();
this.loadUserRides();

}

loadUser(){

this.http.get(`http://localhost:5000/api/admin/user/${this.userId}`)
.subscribe((data:any)=>{

this.user=data;

});

}

loadUserRides(){

this.http.get(`http://localhost:5000/api/admin/user-rides/${this.userId}`)
.subscribe((data:any)=>{

this.rides=data;

this.stats.total=data.length;
this.stats.completed=data.filter((r:any)=>r.status==='completed').length;
this.stats.cancelled=data.filter((r:any)=>r.status==='cancelled').length;

this.cdr.detectChanges();

});

}

}