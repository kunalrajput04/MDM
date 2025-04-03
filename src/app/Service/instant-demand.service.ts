import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstantDemandService {

  constructor(
    private http: HttpClient
  ) { }

  getPrepaidPostpaid(data:string) {
    return this.http.get(`${environment.apiUrl}InstantDemand/GetPrepaidPostPaid?type=` + data);
  }
}
