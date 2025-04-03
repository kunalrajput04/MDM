import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Levls, SubdivisionNameKey } from '../Model/smart-meter';
import { Substation } from '../Model/substation';

@Injectable({
  providedIn: 'root'
})
export class SubstationService {

  levels: Levls = new Levls();
  subdivision: SubdivisionNameKey = new SubdivisionNameKey();
  constructor(private http: HttpClient) {
   
      this.levels = {
        levelName: localStorage.getItem('AccessLevel'),
        levelValue: localStorage.getItem('AccessValue')
      }
    
  }

  getSubstationData() {
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getSubstationList/`,
      this.levels
    );
  }
  
  getSubstationDataForMap(levelValue: string) {
   
    let data = {
      levelName: 'SUBDEVISION',
      levelValue: levelValue
    }
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getSubstationList/`,
      data
    );
  }

  addSubStation(formdata: Substation) {
    formdata.user_id = localStorage.getItem('HesUserID');

   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/addSubstation`,
      formdata
    );
  }


  getSubstationBySubdivision(name: string) {

    this.subdivision.subdivisionName = name;

   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getSubstation`,
      this.subdivision
    );
  }
  deleteSubstationData(formdata: Substation) {
    formdata.user_id = localStorage.getItem('HesUserID');
    return this.http.post(
      `${environment.smartapiUrl}/Evit/deleteSubstation`,
      formdata
    );
  }


}


