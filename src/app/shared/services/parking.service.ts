import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  apiUrl = `${environment.baseUrl}/users`
  getCarApi = `${environment.baseUrl}/carSlots`
  getBikeApi = `${environment.baseUrl}/bikeSlots`

  constructor(private http: HttpClient) { }


  // parking.service.ts
  getSlots(type: 'car' | 'bike'): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/${type}Slots`);
  }



  updateParkingSlot(id: string, vehicleNumber: string, userId: string, type: 'car' | 'bike'): Observable<any> {
    const url = `${environment.baseUrl}/${type}Slots/${id}`;
    const updateData = {
      isActive: true,
      vehicleNumber: vehicleNumber,
      userId: userId
    };

    return this.http.patch(url, updateData);
  }


}
