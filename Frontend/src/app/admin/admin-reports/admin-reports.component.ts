import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
selector:'app-admin-reports',
standalone:true,
imports:[CommonModule,RouterModule,HttpClientModule],
templateUrl:'./admin-reports.component.html',
styleUrls:['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit{

reports:any[]=[];
loading=true;

constructor(private http:HttpClient, private cdr:ChangeDetectorRef){}

ngOnInit(){

this.http.get<any>("http://localhost:5000/api/admin/reports")
.subscribe((data:any)=>{

console.log("Reports:",data);

this.reports=data;
this.loading=false;
this.cdr.detectChanges();

});

}
exportReports(){

window.open("http://localhost:5000/api/admin/reports/export","_blank");
alert("Report downloaded successfully");
}

}