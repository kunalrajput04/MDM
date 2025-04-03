import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  MeterInventory,
  MeterReturn,
  PhysicalStock,
} from '../Model/meter-inventory';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(private http: HttpClient) {}

  manageInventory(data: MeterInventory) {
    return this.http.post(`${environment.apiUrl}Assets/ManageInventory`, data);
  }

  getlastEntry(data: any) {
    return this.http.get(
      `${environment.apiUrl}Assets/GetlastEntry?type=` + data
    );
  }

  getInventoryDashboard() {
    return this.http.get(`${environment.apiUrl}Assets/GetInventoryDashboard`);
  }

  manageMeterReturn(data: MeterReturn) {
    return this.http.post(
      `${environment.apiUrl}Assets/ManageMeterReturn`,
      data
    );
  }

  getMeterReturnLogs(data: any) {
    return this.http.get(
      `${environment.apiUrl}Assets/GetMeterReturnLogs?type=` + data
    );
  }

  getInventoryStock(data: any) {
    return this.http.get(
      `${environment.apiUrl}Assets/GetInventoryStocks?type=` + data
    );
  }

  //#region  Physical Stock

  meterListByCard(data: any) {
    return this.http.post(
      `${environment.apiUrl}Assets/GetMeterListByCard`,
      data
    );
  }

  faultyMeterList() {
    return this.http.get(`${environment.apiUrl}Assets/FaultyMeterList`);
  }

  getInstalledDevice(fromdate: string, toDate: string) {
    return this.http.get(
      `${environment.apiUrl}Assets/GetInstalledDevices?FromDate=` +
        fromdate +
        `&ToDate=` +
        toDate
    );
  }

  getInstalledDevicesSummary(fromdate: string, toDate: string) {
    return this.http.get(
      `${environment.apiUrl}Assets/GetInstalledDevicesSummary?FromDate=` +
        fromdate +
        `&ToDate=` +
        toDate
    );
  }

  stockMeterList(data: any) {
    return this.http.post(`${environment.apiUrl}Assets/StockMeterList`, data);
  }
  stockCountMeterList(data: any) {
    return this.http.post(`${environment.apiUrl}Assets/GetStockList`, data);
  }
  meterCount() {
    return this.http.get(`${environment.apiUrl}Assets/MeterCount`);
  }

  ExcelUpload(postedFile: File) {
    const formData = new FormData();
    formData.append('formFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.apiUrl}Assets/ImportMeterStatus`,
      formData
    );
  }
  //#endregion
}
