import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Group } from '../Model/group';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http:HttpClient
  ) { }

   
  manageGroup(data:Group) {
    return this.http.post(`${environment.apiUrl}User/ManageGroup`, data);
  }

  getGroupList() {
    return this.http.get(`${environment.apiUrl}User/GetGroupList`);
  }

  getGroupListbyrole(data:any) {
    return this.http.get(`${environment.apiUrl}User/GetGroupListByRole?role=` +data);
  }

  getGroupbyId(data:number) {
    return this.http.get(`${environment.apiUrl}User/GetGroupById?Id=` + data);
  }

  getMembers() {
    return this.http.get(`${environment.apiUrl}User/GetAllMembers`);
  }
  getModulePermission() {
    return this.http.get(`${environment.apiUrl}User/GetModulePermissin`);
  }

  CheckExistingUserByMail(email:any) {
    return this.http.get(`${environment.apiUrl}User/CheckExistingUserByMail?email=` + email);
  }
  GetAllEmailAndSms(data: any) {
    return this.http.post(`${environment.apiUrl}User/GetEmailAndSmsmLog`, data);
  }
  removeUser(data:number){
    return this.http.get(`${environment.apiUrl}User/RemoveUser?Id=` + data);
  }

}
