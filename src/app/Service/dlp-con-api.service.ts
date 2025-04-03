import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DlpConApiService {
  private apiUrl = 'https://vee.meghasmarts.com:5001/api/HTDLPMeterViewModels';
  constructor(private http:HttpClient) { }
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getConsumerData(consumerNo: string): Observable<any[]> {
    const url = `${this.apiUrl}/${consumerNo}`;
  
    return this.http.get<any[]>(url);
  }
  

  getDataByDateRange(params: { fromDate: string; toDate: string; consumerNo: string }): Observable<any[]> {
    const url = `${this.apiUrl}/${params.consumerNo}?fromDate=${params.fromDate}&toDate=${params.toDate}`;
    return this.http.get<any[]>(url);
  }
}
