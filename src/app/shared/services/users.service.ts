import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _http: HttpClient) { }

  register(user: any): Observable<any> {
    return this._http.post(environment.baseUrl, user);
  }

  getUsers(): Observable<any> {
    return this._http.get<any>(environment.baseUrl);
  }

}
