import { Component,OnInit } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
selector:'app-admin-drivers',
standalone:true,
imports:[CommonModule,HttpClientModule,FormsModule,RouterModule],
templateUrl:'./admin-drivers.component.html',
styleUrls:['./admin-drivers.component.css']
})
export class AdminDriversComponent implements OnInit{

drivers:any[]=[];
filteredDrivers:any[]=[];
searchText='';
loading=true;

constructor(private http:HttpClient){}

ngOnInit(){
this.loadDrivers();
}

loadDrivers(){

this.http.get<any[]>("http://localhost:5000/api/admin/drivers")
.subscribe(data=>{

this.drivers=data;
this.filteredDrivers=data;
this.loading=false;

});

}
applySearch(){
this.filteredDrivers=this.drivers.filter(d=>
d.name.toLowerCase().includes(this.searchText.toLowerCase())
);
}
}