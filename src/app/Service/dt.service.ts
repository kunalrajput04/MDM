import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dt } from '../Model/dt';
import { GetDT, Levls } from '../Model/smart-meter';

@Injectable({
  providedIn: 'root'
})
export class DTService {

  data: Levls = new Levls();
  ownerdata: GetDT = new GetDT();
  constructor(private http: HttpClient) {
    this.data = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue')
    }
  }

  addDT(model: Dt) {
    model.ownerName = localStorage.getItem('HesUserID');
    return this.http.post(
      `${environment.smartapiUrl}/Evit/addDT/`,
      model
    );
  }
  getDTByFeeder(feeder: string) {
    this.ownerdata.feederName = feeder;
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getDT`,
      this.ownerdata
    );
  }

  getDtData() {
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getDtTransList/`,
      this.data
    );
  }
  getDtDataForMap(levelvalue: string) {
    let data = {
      levelName: 'FEEDER',
      levelValue: levelvalue
    }
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getDtTransList/`,
      data
    );
  }
  deleteDTData(data: Dt) {
    return this.http.post(
      `${environment.smartapiUrl}/Evit/deleteDT/`,
      data
    );
  }


}
