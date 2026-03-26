import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  API = 'http://localhost:5000/api/rides';

  constructor(private http: HttpClient) {}   

  bookRide(data: any) {
    return this.http.post(`${this.API}/book`, data);
  }

  getUserHistory(userId: string) {
    return this.http.get<any[]>(`${this.API}/history/${userId}`);
  }

  cancelRide(id: string) {
    return this.http.put(`${this.API}/cancel/${id}`, {});
  }

  rateRide(id: string, data: any) {
  return this.http.put(`${this.API}/rate/${id}`, data);
}
getDrivers(){
return this.http.get('http://localhost:5000/api/admin/drivers');
}

assignDriver(rideId:any,driverId:any){
return this.http.patch(
`http://localhost:5000/api/admin/assign-driver/${rideId}`,
{driverId}
);
}
}
