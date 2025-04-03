import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewMeter } from '../Model/new-meter';
import { MeterReport } from '../Model/meter-report';

@Injectable({
  providedIn: 'root',
})
export class NewMeterService {
  constructor(private http: HttpClient) { }

  //#region  New Meter

  manageNewMeter(formData: NewMeter) {
    return this.http.post(
      `${environment.masterapiUrl}Meter/ManageNewMeter`,
      formData
    );
  }
  getAllNewMeter() {
    return this.http.get(`${environment.masterapiUrl}Meter/GetAllNewMeter`);
  }
  getAllOldMeterRender(data: any) {
    return this.http.post(
      `${environment.masterapiUrl}Meter/GetAllNewMeterRender`,data
    );
  }
   getAllNewMeterRender(data: any) {
    return this.http.post(`${environment.apiUrl}Assets/GetAllNewMeterRender?recordCount=` ,data);
  }
 
  // ExportMeterData() {
  //   return this.http.get(`${environment.masterapiUrl}/Meter/ExportFullNewMeter`, {
  //     responseType: 'arraybuffer',
  //   });
  // }

  ExportMeterData() {
    return this.http.get(`${environment.apiUrl}Assets/ExportFullNewMeter`, {
      responseType: 'arraybuffer',
    });
  }

  getNewMeterByID(newMeterid: number) {
    return this.http.get(
      `${environment.masterapiUrl}Meter/GetNewMeterByID?meterID=` + newMeterid
    );
  }
  deleteNewMeter(newMeterid: number) {
    return this.http.get(
      `${environment.masterapiUrl}/NewMeter/DeleteNewMeter?newMeterID=` + newMeterid
    );
  }
  
  getAllNewMeterReport(formData: MeterReport) {
    return this.http.post(
      `${environment.masterapiUrl}/Meter/GetAllMeterReport`,
      formData
    );
  }
  // getConsumerInfo(formData: MeterReport) {
  //   return this.http.post(
  //     `${environment.masterapiUrl}Meter/GetConsumerAndMeterInfo`,
  //     formData
  //   );
  // }

  UpdateMeterByMeterIDList(meterID: number[]) {
    return this.http.post(
      `${environment.masterapiUrl}/Meter/UpdateMeterByMeterIDList`,
      meterID
    );
  }
  DeleteNewMeter(data: any) {
    return this.http.post(`${environment.masterapiUrl}/Meter/DeleteNewMeter`, data);
  }
  //#endregion New Meter End

  //#region  MeterExport

  ExportNewMeter() {
    return this.http.get(`${environment.masterapiUrl}Meter/NewMeterExport`, {
      responseType: 'arraybuffer',
    });
  }

  //#endregion

  //#region  Assign Meter

  // createAssignMeter(formData: AssignMeter) {
  //   return this.http.post(
  //     `${environment.masterapiUrl}Meter/CreateAssignMeter`,
  //     formData
  //   );
  // }

  // getAssignMeter(data: MeterReport) {
  //   return this.http.post(`${environment.masterapiUrl}Meter/AssignMeter`, data);
  // }

  getAssignMeterByAssignID(data: number) {
    return this.http.get(
      `${environment.masterapiUrl}Meter/AssignMeterByAssignID?assignid=` + data
    );
  }

  //#endregion Assign Meter End

  //#region Incoming Meter

  // createIncomingMeter(formData: IncomingMeter) {
  //   return this.http.post(
  //     `${environment.masterapiUrl}Meter/CreateIncomingMeter`,
  //     formData
  //   );
  // }
  // getIncomingMeter(data: MeterReport) {
  //   return this.http.post(`${environment.masterapiUrl}Meter/IncomingMeter`, data);
  // }
  // getIncomingMeterPrint(data: MeterReport) {
  //   return this.http.post(
  //     `${environment.masterapiUrl}Meter/IncomingMeterPrint`,
  //     data
  //   );
  // }

  //#endregion

  //#region  New Consumer

  // getAllNewConsumer(formData: MeterReport) {
  //   return this.http.post(
  //     `${environment.masterapiUrl}Meter/GetAllNewConsumer`,
  //     formData
  //   );
  // }

  //#endregion

  ExcelUpload(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Meter/AddMeterByCustomerNoExcel`,
      formData
    );
  }
  UploadNewMeterExcel(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Meter/AddNewMeterByExcel`,
      formData
    );
  }

  //Return Meter
  // getReturnMeter(data: MeterReport) {
  //   return this.http.post(`${environment.masterapiUrl}Meter/ReturnMeterList`, data);
  // }
  getUpdateReturnMeter(meterid: number) {
    return this.http.get(
      `${environment.masterapiUrl}Meter/UpdateReturnMeter?id=` + meterid
    );
  }
  //End Return Meter

  /// <summary>
  /// Modified By : Nagendra Kumar
  /// Modified Date : 08-Sep-2021
  /// Created By : Nagendra Kumar
  /// Created Date : 08-Sep-2021
  /// Description : Get Meter Count list from api
  /// What Modified : 
  /// </summary>

  getMeterCountList() {
    return this.http.get(`${environment.masterapiUrl}Meter/GetMeterCountReport`);
  }


  UpdateNewMeterLatLong(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Meter/UpdateMeterLatLong`,
      formData
    );
  }
  ReplaceMeter(postedFile: File) {
    const formData = new FormData();
    formData.append('postedFile', postedFile, postedFile.name);
    return this.http.post(
      `${environment.masterapiUrl}/Meter/ReplaceMeterNumber`,
      formData
    );
  }

}
