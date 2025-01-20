import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _http: HttpClient) { 
    
  }

  register(user: any): Observable<any> {
    return this._http.post(`${environment.baseUrl}/users`, user);
  }

  getUsers(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/users`);
  }


  

}
