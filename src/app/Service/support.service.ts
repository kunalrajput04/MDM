import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OutageInformation } from '../Model/outage-information';
import { Support, SupportInfo } from '../Model/support';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  constructor(private http: HttpClient) {}

  Create(data: Support) {
    return this.http.post(`${environment.apiUrl}Support/Create`, data);
  }

  manageSupport(data: SupportInfo) {
    return this.http.post(`${environment.apiUrl}Support/ManageSupport`, data);
  }

  getInfoById(data: number) {
    return this.http.get(`${environment.apiUrl}Support/GetInfoById?Id=` + data);
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}Support/GetAll`);
  }

  getAllByReferenceId(data: string) {
    return this.http.get(
      `${environment.apiUrl}Support/GetAllByReferenceId?ReferId=` + data
    );
  }

  closeComplaint(data: string) {
    return this.http.get(
      `${environment.apiUrl}Support/CloseSuppport?ReferenceId=` + data
    );
  }

  manageOutageInfo(data: OutageInformation) {
    return this.http.post(
      `${environment.apiUrl}Utility/OutageInformationCreate`,
      data
    );
  }
  getOutageInfo() {
    return this.http.get(`${environment.apiUrl}Utility/GetOutageInformation`);
  }
}
