import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MeterInventory } from '../Model/meter-inventory';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(private http: HttpClient) { }

  getRevenueTree() {
    let accesslevel=localStorage.getItem('AccessLevel');
    let accessvalue=localStorage.getItem('AccessValue');
    return this.http.get(
      `${environment.apiUrl}Revenue/GetRevenueTree?AccessLevel=` + accesslevel + `&AccessValue=`+ accessvalue);
  }

  getDailySummary(){
    return this.http.get(
      `${environment.apiUrl}Revenue/PrepaidDailySummary`);
  } 

  getMonthlySummary(){
    return this.http.get(
      `${environment.apiUrl}Revenue/PrepaidMonthlySummary`);
  } 
  


  

}
