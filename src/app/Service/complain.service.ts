import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Complain, ComplainInfo } from '../Model/complain';

@Injectable({
  providedIn: 'root'
})
export class ComplainService {

  constructor(
    private http:HttpClient
  ) { }

  Create(data:Complain){
    return this.http.post(`${environment.apiUrl}Complain/Create`,data);
  }


  manageComplain(data:ComplainInfo){
    return this.http.post(`${environment.apiUrl}Complain/ManageComplain`,data);
  }

  getInfoById(data:number) {
    return this.http.get(`${environment.apiUrl}Complain/GetInfoById?Id=` + data);
  }
  closeComplaint(data:string) {
    return this.http.get(`${environment.apiUrl}Complain/CloseComplaint?ReferenceId=` + data);
  }

  getAll(){
    return this.http.get(`${environment.apiUrl}Complain/GetAll`)
  }

  getAllByReferenceId(data:string){
    return this.http.get(`${environment.apiUrl}Complain/GetAllByReferenceId?ReferId=` + data)
  }

}
