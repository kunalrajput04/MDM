import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsumerMeterInfo } from '../Model/consumer-meter-info';

@Injectable({
  providedIn: 'root'
})
export class SmartMeterService {

  constructor(private http: HttpClient) { }
  getConsumerMeter(consumerno: string) {
    return this.http.get(
      `${environment.apiUrl}Consumer/GetConsumerDetails?consumerno=` + consumerno);
  }
  getAllUpdateRequest() {
    return this.http.get(
      `${environment.apiUrl}Consumer/GetConsumerUpdateRequest`);
  }

  getConsumerCount() {
    return this.http.get(
      `${environment.apiUrl}Consumer/GetConsumerCount`);
  }
  
  getConsumerNumberList(consumerno: string) {
    return this.http.get(
      `${environment.apiUrl}Consumer/GetConsumerNumber?consumerno=` + consumerno);
  }

  getPrepaidConsumerNumberList(consumerno: string) {
    return this.http.get(
      `${environment.apiUrl}Consumer/GetPrepaidConsumerNumber?consumerno=` + consumerno);
  }


  manageConsumer(model: ConsumerMeterInfo) {
    return this.http.post(
      `${environment.apiUrl}Consumer/ManageConsumerInfo`,
      model
    );
  }

  deleteRequest(data:string,actiontype:string,reason:string) {
    let obj={
      requestID: data,
      actionType:actiontype,
      reason:reason
    };
    return this.http.post(
      `${environment.apiUrl}Consumer/DeleteRequest`,
      obj
    );
  }

  ExcelUploadCustomerData(postedFile: File,changeTo:string,assignTo:number) {
    
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    formData.append('assignTo', assignTo.toString());
    formData.append('changeTo', changeTo);
    return this.http.post(
      `${environment.apiUrl}Consumer/UploadConsumerFile`,
      formData
    );
  }
  getConsumerWithMeterNo(consumerno: string) {
    return this.http.get(
      `${environment.apiUrl}Consumer/GetConsumerNumberWithMeterNo?consumerno=` + consumerno);
  }


  //Firmware 
  
  addFirmware(postedFile: File, status: string, version: string, manufacturer: string) {


    let data = {
      owner: localStorage.getItem("HesUserID"),
      fileName: postedFile.name.replace(/\.[^/.]+$/, ""),
      status: status,
      version: version,
      manufacturer: manufacturer,
      imageIdentifier:postedFile.name.replace(/\.[^/.]+$/, ""),
    }
    const formData = new FormData();
    formData.append('firmwareFile', postedFile);
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
   

    return this.http.post(
      `${environment.smartapiUrl}/firmware/uploadFile`,
      formData
    );
  }
  addConfigs(levelName: string, levelValue: string, configVals: any,skipOtherManufacturer:boolean) {

    let data = {
      levelName: levelName,
      levelValue: levelValue,
      configVals: configVals,
      skipOtherManufacturer: skipOtherManufacturer
    }
   

    return this.http.post(
      `${environment.smartapiUrl}/firmware/configs/add`,
      data
    );
  }
  getFirmwareList() {
    let data = {
      owner: localStorage.getItem("HesUserID")
    }
   

    return this.http.post(
      `${environment.smartapiUrl}/firmware/list`,
      data
    );
  }

  deleteFirmwareList(data: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
      body: data
    };
    return this.http.delete(
      `${environment.smartapiUrl}/firmware/list`,
      httpOptions
    );
  }
  updateFirmwareList(data: any) {
    let dataList = [
      {
        owner: data.owner,
        status: data.status,
        version: data.version,
        manufacturer: data.manufacturer,
        fileName: data.fileName,
        imageIdentifier: data.imageIdentifier
      }
    ]


   
    return this.http.put(
      `${environment.smartapiUrl}/firmware/list`,
      dataList
    );

  }

}
