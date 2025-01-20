import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  apiUrl = `${environment.baseUrl}`
  url = 'http://localhost:3000/parkedVehicle'
  constructor(private http : HttpClient) { }

  // sendObj(user : any) : Observable<any> {
  //   return this.http.post<any>(this.url, user)
  // }

  // Get user by ID
  // getUserById(userId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/users/${userId}`);
  // }

  // // Update user's assigned vehicles
  // updateUser(userId: number, userData: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  // }

  // // Get all slots
  // getSlots(): Observable<any> {
  //   return this.http.get(`${this.url}/slots`);
  // }

  // // Update slot status
  // updateSlot(slotId: number, slotData: any): Observable<any> {
  //   return this.http.put(`${this.url}/slots/${slotId}`, slotData);
  // }


}
