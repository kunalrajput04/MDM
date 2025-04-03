import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IConfigRequest } from '../Model/iconfig-request';

@Injectable({
  providedIn: 'root'
})
export class IConfigServiceService {

  constructor(private http: HttpClient) { }
  manageRequest(data: IConfigRequest) {
    return this.http.post(`${environment.apiUrl}ServiceRequest/ManageConfiguration`, data);
  }

  getConfigurationAll() {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetAllConfiguration`)
  }
  getConfigDetails(requestID: number) {
    return this.http.get(`${environment.apiUrl}ServiceRequest/GetConfigurationDetails?RequestID=` + requestID)
  }

  executeCommandForConfiguration(
    command: string,
    commandvalue: string,
    levelname: string,
    levelvalue: string
  ) {
    let obj = {

      command : command,
      commandsVal : commandvalue,
      levelName : levelname,
      levelValue : levelvalue,
    }
   

    return this.http.post(
      `${environment.apiUrl}/Evit/addConfigsCommand`,
      obj
    );
  }
}
