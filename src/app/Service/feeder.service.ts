import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Feeder } from '../Model/feeder';
import { Levls, SubdivisionNameKey, SubstationNameKey } from '../Model/smart-meter';

@Injectable({
  providedIn: 'root'
})
export class FeederService {
  data: Levls = new Levls();
  substationdata: SubstationNameKey = new SubstationNameKey();
  constructor(private http:HttpClient) {
    
      this.data = {
        levelName: localStorage.getItem('AccessLevel'),
        levelValue: localStorage.getItem('AccessValue')
      }
    
    
   }


   addFeeder(formdata: Feeder) {
    formdata.user_id = localStorage.getItem('HesUserID');

   
    return this.http.post(
      `${environment.smartapiUrl}/Evit/addFeeder`,
      formdata
    );
  }

  //#region  OldApi
  getFeederList() {
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getFeederList/`,
      this.data
    );
  }
  getFeederListForMap(levelValue:string) {
   
    let data = {
      levelName: 'SUBSTATION',
      levelValue: levelValue
    }
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getFeederList/`,
      data
    );
  }

  deleteFeeder(data: Feeder) {
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/deleteFeeder/`,
      data
    );
  }

  getFeederBySubstation(name: string) {
    this.substationdata.substationName = name;
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getFeeders/`,
      this.substationdata
    );
  }


}
