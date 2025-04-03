import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IServiceRequestAdd } from '../Model/iservice-request-add';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  constructor(private http: HttpClient) { }

  //#region Service Request


  manageRequest(data: IServiceRequestAdd) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/ManageRequest`, data);
  }

  uploadmultipleRequest(data: IServiceRequestAdd) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/UploadServiceRequest`, data);
  }
  uploadlevelRequest(data: IServiceRequestAdd) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/UploadLevelServiceRequest`, data);
  }


  getAll() {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetAllRequest`)
  }
  getConsumerByBillingType(billingType: string) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetAllBillingTypeConsumer?billingtype=` + billingType)
  }
  getConsumerByLevelType(accesslevel: string, accessValue) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetAllLevelTypeConsumer?accesslevel=` + accesslevel + `&accessvalue=` + accessValue)
  }
  getRequestDetails(requestID: number) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetRequestDetails?RequestID=` + requestID)
  }

  GetRequestinfo(requestID: number) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetRequestinfo?RequestID=` + requestID)
  }

  ImportServiceRequestExcel(postedFile: File, requestType: string, requestTo: string) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    formData.append('requestType', requestType);
    formData.append('requestTo', requestTo);
    return this.http.post(
      `${environment.apiUrl}ServiceRequest/ImportServiceRequest`,
      formData
    );
  }

  //#endregion End Service Request



  //#region Tariff Request


  manageTariffRequest(data: IServiceRequestAdd) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/ManageTariffRequest`, data);
  }


  getTariffAll() {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetAllTariffRequest`)
  }
  getTariffRequestDetails(requestID: number) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetTariffRequestDetails?RequestID=` + requestID)
  }


  //#endregion End Tariff Request


}
