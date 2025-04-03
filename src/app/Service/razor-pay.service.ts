import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Payment } from '../Model/payment';

@Injectable({
  providedIn: 'root'
})
export class RazorPayService {

  constructor(private http: HttpClient) { }

  makePayment(data: Payment) {
    return this.http.post(`${environment.apiUrl}Revenue/MakePayment`, data);
  }

  getAllTranscation() {
    return this.http.get(`${environment.apiUrl}Revenue/GetAllTransactions`);
  }

  getAllbyCnO(data: string) {
    return this.http.get(
      `${environment.apiUrl}Revenue/GetAllByCno?Cno=` + data
    );
  }
}
