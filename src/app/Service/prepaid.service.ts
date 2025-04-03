import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsumerUpdateRequest } from '../Model/iservice-request';
import { DataFilter, MyDataFilter, PrepaidRecharge } from '../Model/prepaid-recharge';

@Injectable({
  providedIn: 'root'
})
export class PrepaidService {

  constructor(private http: HttpClient) { }

  GetAllRecharges(data:MyDataFilter){
    return this.http.get(
      `${environment.apiUrl}Revenue/GetAllRecharges?from=` + data.from + `&to=` + data.to);
  } 

  ManageRecharge(data:PrepaidRecharge){
    return this.http.post(
      `${environment.apiUrl}Revenue/ManageRecharge`,data );
  } 

  GetRechargeInfo(data:any){
    return this.http.get(
      `${environment.apiUrl}Revenue/GetRechargeInfo?transId=` + data);
  } 

 
  GetPrepaidconsumers(accesslevel: string, accessValue){
    return this.http.get(
      `${environment.apiUrl}Consumer/GetAllLevelTypePrepaidConsumers?accesslevel=` + accesslevel + `&accessvalue=` + accessValue);
  } 

  GetLowBalanceConsumers(){
    return this.http.get(
      `${environment.apiUrl}Consumer/GetLowBalanceConsumers`);
  } 

//#region 

GetAllTariffDropdown(){
  return this.http.get(
    `${environment.apiUrl}ServiceRequest/GetAllTariffDropdown`);
}

ManageNewTariff(data:any){

  return this.http.post(
    `${environment.apiUrl}ServiceRequest/ManageNewTariff`,data);

}

GetAllNewTariff(){
  return this.http.get(
    `${environment.apiUrl}ServiceRequest/GetAllNewTariff`);
}

GetNewTarrifInfo(data:number){
  return this.http.get(
    `${environment.apiUrl}ServiceRequest/GetNewTarrifInfo?Id=` + data);

}

DeleteNewTarrif(data:number){
  return this.http.get(
    `${environment.apiUrl}ServiceRequest/DeleteNewTarrif?Id=` + data);

}
ActiveTarrif(data:number){
  return this.http.get(
    `${environment.apiUrl}ServiceRequest/ActiveTarrif?Id=` + data);

}





//#endregion

//#endregion


//#region  consumerUpdateRequests
ManageConsumerRequest(data:ConsumerUpdateRequest){
  return this.http.post(
    `${environment.apiUrl}Consumer/ManageConsumerRequest`,data);

}

GetConsumerUpdateRequestList(){
  return this.http.get(
  `${environment.apiUrl}Consumer/GetConsumerUpdateRequestList`);
}

ConsumerUpdatebyStatus(Id:number, status:string,consumerno:string,changeto:string){
  return this.http.get(
    `${environment.apiUrl}Consumer/ConsumerUpdatebyStatus?Id=` + Id + `&status=` + status + `&consumerno=` + consumerno + `&changeto=`+ changeto );

}

GetConsumerUpdateInfo(data:any){
  return this.http.get(
    `${environment.apiUrl}Consumer/GetConsumerUpdateInfo?reqno=` + data);
}

//#endregion



}
