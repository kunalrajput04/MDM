import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBoosterRequest } from '../Model/ibooster-request';

@Injectable({
  providedIn: 'root'
})
export class BoosterServiceService {

  constructor(private http: HttpClient) { }

  
  manageRequest(data: IBoosterRequest) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/ManageBooster`, data);
  }
  getAllBooster() {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetAllBoosterRequest`)
  }
  
  getBoosterDetails(requestID: number) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetBoosterDetails?RequestID=` + requestID)
  }

}
