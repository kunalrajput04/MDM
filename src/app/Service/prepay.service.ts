import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICustomHoliday, IPrepayConfig } from '../Model/iprepay-config';

@Injectable({
  providedIn: 'root'
})
export class PrepayService {

  constructor(private http: HttpClient) { }

  getPrepayDetails() {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetPrePayDetails`)
  }
  getHolidayList() {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetHolidayList`)
  }
  managePrepayDetails(data:IPrepayConfig) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/UpdatePrePay`,data)
  }
  manageHoliday(data:ICustomHoliday) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/AddHoliday`,data)
  }
  deleteHoliday(data:ICustomHoliday) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/DeleteHoliday`,data)
  }
}
