import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetSubdivision, UserKey } from '../Model/smart-meter';
import { Subdivision } from '../Model/subdivision';

@Injectable({
  providedIn: 'root'
})
export class SubdivisionService {
  data: UserKey = new UserKey();
  ownerdata: GetSubdivision = new GetSubdivision();
  constructor(
    private http: HttpClient) {

  }


  addSubdivision(formdata: Subdivision) {
    formdata.user_id = localStorage.getItem('HesUserID');
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/addSubdevision`,
      formdata
    );
  }

  getSubdivisions(data:any) {
       
    this.ownerdata = {
      ownerName: data
    };
   
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getSubdivision`,
      this.ownerdata
    );
  }
 


  getSubdivision() {
       
    this.ownerdata = {
      ownerName: localStorage.getItem('HesUserID'),
    };
   
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getSubdivision`,
      this.ownerdata
    );
  }
 
  getUtility() {
   
    return this.http.get(
      `${environment.smartapiUrl}/Evit/getOwnerList/XXXXX`
    );
  }

  //#region oldListingapi

  //#endregion

  getAllSubDivisioin() {
    this.data = {
      user_id: localStorage.getItem('HesUserID')
    };
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getSubdivisionList`,
      this.data
    );
  }

 
  deleteSubDivion(data: Subdivision) {
   

    return this.http.post(
      `${environment.smartapiUrl}/Evit/deleteSubdevision/`,
      data
    );
  }
  

}
