import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MeterDatas } from '../Model/meter-data';

@Injectable({
  providedIn: 'root',
})
export class ExceptionServiceService {
  getdata: MeterDatas = new MeterDatas();
  constructor(private http: HttpClient) {}

  getEventData(
    fromdate: any,
    todate: any,
    meterNo: string,
    levelname: string,
    levelvalue: string
  ) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = levelname;
      this.getdata.level_value = levelvalue;
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` + meterPhase + `/getEventData` + ``,
      this.getdata
    );
  }

  GetCriticalEvents(data: any) {
    return this.http.post(
      `${environment.apiUrl}Exception/GetCriticalEvents`,
      data
    );
  }
  getNewEvents(data: any) {
    return this.http.post(`${environment.apiUrl}Exception/getNewEvents`, data);
  }
  getAlarmEvents(data: any) {
    return this.http.post(
      `${environment.apiUrl}Exception/getAlarmEvents`,
      data
    );
  }

  getEventsCount() {
    return this.http.get(`${environment.apiUrl}Exception/CountEvents`);
  }
  getEventsForChart(daytype: string) {
    return this.http.get(
      `${environment.apiUrl}Exception/GetEventsForChart?daytype=` + daytype
    );
  }

  getAccessLevelDropdown(accessLevel: string, iD: number) {
    return this.http.get(
      `${environment.apiUrl}Utility/GetAccessLevelDropDown?accessLevel=` +
        accessLevel +
        `&iD=` +
        iD
    );
  }

  markAsReadNewEvents(data: any) {
    return this.http.post(
      `${environment.apiUrl}Exception/MarkAsReadNewEvents`,
      data
    );
  }
  raiseTicket(data: any) {
    return this.http.post(`${environment.apiUrl}Exception/RaiseTicket`, data);
  }
}
