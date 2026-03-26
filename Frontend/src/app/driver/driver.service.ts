import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private baseUrl = 'http://localhost:5000/api/driver';

  constructor(private http: HttpClient) {}

  getPendingRides(driverId: string) {
  return this.http.get<any[]>(
    `http://localhost:5000/api/driver/pending-rides/${driverId}`
  );
}

  getActiveRide(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/active/${driverId}`);
  }

  acceptRide(rideId: string, driverId: string) {
    return this.http.put(`${this.baseUrl}/accept/${rideId}/${driverId}`, {});
  }

  startRide(rideId: string) {
    return this.http.put(`${this.baseUrl}/start/${rideId}`, {});
  }

  completeRide(rideId: string) {
    return this.http.put(`${this.baseUrl}/complete/${rideId}`, {});
  }

  onTheWay(rideId: string) {
  return this.http.put(
    `http://localhost:5000/api/driver/on-the-way/${rideId}`,
    {}
  );
}
  getDashboard(driverId: string) {
    return this.http.get(`${this.baseUrl}/dashboard/${driverId}`);
  }
  getRatings(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ratings/${driverId}`);
  }

  getEarnings(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/earnings/${driverId}`);
  }
  getDriverHistory(driverId: string) {
  return this.http.get<any[]>(`http://localhost:5000/api/driver/history/${driverId}`);
}
getAnalytics(driverId: string) {
  return this.http.get<any>(
    `http://localhost:5000/api/driver/analytics/${driverId}`
  );
}
toggleStatus(driverId: string) {
  return this.http.put(
    `http://localhost:5000/api/driver/toggle-status/${driverId}`,
    {}
  );
}
expireRide(rideId: string) {
  return this.http.put(
    `http://localhost:5000/api/driver/expire/${rideId}`,
    {}
  );
}
setOffline(driverId: string) {
  return this.http.put(
    `http://localhost:5000/api/driver/set-offline/${driverId}`,
    {}
  ); 
}
cancelRide(rideId: string, reason: string) {
  return this.http.put(
    `http://localhost:5000/api/driver/cancel/${rideId}`,
    { reason }
  );
}
}