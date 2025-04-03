import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DT } from '../Model/dt';
import { Feeder } from '../Model/feeder';
import { Subdivision } from '../Model/subdivision';
import { Substation } from '../Model/substation';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}
  
  //#region Subdivision
  manageSubdivision(formData: Subdivision) {
    return this.http.post(
      `${environment.masterapiUrl}/Master/ManageSubDivision`,
      formData
    );
  }

  GetAllSubdivison() {
    return this.http.get(`${environment.masterapiUrl}/Master/GetSubdivisionList`);
  }
 
  //#endregion

  //#region Substation
  manageSubstation(formData: Substation) {
    return this.http.post(
      `${environment.masterapiUrl}/Master/ManageSubSubstation`,
      formData
    );
  }
  ExportSimData() {
    return this.http.get(`${environment.masterapiUrl}/Master/SimDataExport`, {
      responseType: 'arraybuffer',
    });
  }
  GetAllSubstation() {
    return this.http.get(`${environment.masterapiUrl}/Master/GetAllSubstation`);
  }
  GetSubdivisonDropDown() {
    return this.http.get(`${environment.masterapiUrl}/Master/GetSubdivisionDropdown`);
  }

  GetSubstationDropDown(divisionid: number) {
    return this.http.get(
      `${environment.masterapiUrl}/Master/GetSubstationDropdown?divisionid=` +
        divisionid
    );
  }
  //#endregion

  //#region Feeder
  manageFeeder(formData: Feeder) {
    return this.http.post(
      `${environment.masterapiUrl}/Master/ManageFeeder`,
      formData
    );
  }
  GetAllFeeder() {
    return this.http.get(`${environment.masterapiUrl}/Master/GetAllFeeder`);
  }
  GetFeederDropDown(substation: number) {
    return this.http.get(
      `${environment.masterapiUrl}/Master/GetFeederDropdown?substationid=` +
        substation
    );
  }
  //#endregion

  //#region DT
  manageDT(formData: DT) {
    return this.http.post(`${environment.masterapiUrl}/Master/ManageDT`, formData);
  }
  GetAllDT() {
    return this.http.get(`${environment.masterapiUrl}/Master/GetAllDT`);
  }

  GetDTDropDown(feeder: number) {
    return this.http.get(
      `${environment.masterapiUrl}/Master/GetDTDropdown?feederid=` + feeder
    );
  }

  //#endregion

  // #region SimData
  GetSimData() {
    return this.http.get(`${environment.masterapiUrl}/Master/GetSimData`);
  }
  GetSimDataRender(data: any) {
    return this.http.post(`${environment.masterapiUrl}/Master/GetSimDataRender`, data);
  }
  //#endregion

  // #region Customer Data
  GetCustomerData(data: any) {
    return this.http.post(`${environment.masterapiUrl}/Master/GetCustomerData`, data);
  }

  // get new customer data
  GetNewCustomerData(data: any) {
    return this.http.post(`${environment.masterapiUrl}/Master/GetCustomerData`, data);
  }



  DeleteCustomerData(data: any) {
    return this.http.post(`${environment.masterapiUrl}/Master/DeleteSelectedCustomer`, data);
  }
  DeleteSimData(data: any) {
    return this.http.post(`${environment.masterapiUrl}/Master/DeleteSelectedSim`, data);
  }

  ExportCustomerData() {
    return this.http.get(`${environment.masterapiUrl}/Master/CustomerDataExport`, {
      responseType: 'arraybuffer',
    });
  }

  //#endregion

  //#region  FileUpload

  ExcelUpload(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Master/UploadExcelProduct`,
      formData
    );
  }
  SimStatusExcelUpload(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Master/UploadSimStatusExcel`,
      formData
    );
  }

  ExcelUploadCustomerData(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Master/UploadExcelCustomer`,
      formData
    );
  }
  ExcelUploadCustomerNameAndNo(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Master/UploadCustomerName`,
      formData
    );
  }

  SyncNow() {
    return this.http.get(`${environment.masterapiUrl}/Master/SyncCustomerData`);
  }
  
  CheckCustomerDataAvilable() {
    return this.http.get(`${environment.masterapiUrl}/Master/CheckIsDataInTempCustomerTable`);
  }

  //#endregion

  //#region  GetDashboard
  getdashboard() {
    return this.http.get(`${environment.masterapiUrl}/Account/GetDashboard`);
  }
  getStoredashboard() {
    return this.http.get(`${environment.masterapiUrl}/Account/GetStoreDashboard`);
  }

  //#endregion
}