import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeterService {
  constructor(private http: HttpClient) { }

  getAllNewMeterRender(data: any) {
    return this.http.post(`${environment.apiUrl}Assets/GetAllNewMeterRender?recordCount=` ,data);
  }

  getAllOldMeterRender(data: any) {
    return this.http.post(
      `${environment.apiUrl}Assets/GetAllOldMeterRender`,
      data
    );
  }

}
