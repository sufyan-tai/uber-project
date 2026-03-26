import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

users:any[]=[];
filteredUsers:any[]=[];
loading=true;

searchText="";

constructor(private http:HttpClient, private cdr:ChangeDetectorRef){}

ngOnInit(){

this.http.get<any[]>("http://localhost:5000/api/admin/users")
.subscribe({
next:(data)=>{

this.users=data;
this.filteredUsers=data;

this.loading=false;

this.cdr.detectChanges();

},
error:(err)=>{

console.log(err);
this.loading=false;

}
});

}

applySearch(){

this.filteredUsers=this.users.filter((user:any)=>
user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
user.email.toLowerCase().includes(this.searchText.toLowerCase())
);

}

}