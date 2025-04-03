import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeaderMenu } from '../Model/header-menu';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Model/login';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

export class Tokens {
  accessToken: string;
  refreshToken: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;
  private data: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  menu: HeaderMenu = new HeaderMenu();
  private headernav = new BehaviorSubject(this.menu);
  currentheadernav = this.headernav.asObservable();

  login(user) {

    return this.http.post(`${environment.apiUrl}Account/Login`, user);
  }
  logout() {

    return this.http.get(`${environment.apiUrl}Account/Logout`);
  }
  changePassword(data: any) {

    return this.http.post(`${environment.apiUrl}Account/ChangePassword`, data);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  forgotPassword(formData: string) {
    return this.http.get(
      `${environment.apiUrl}Account/ForgotPassword?emailaddress=` + formData
    );
  }


  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getLoginLogs() {
    return this.http.get(`${environment.apiUrl}Account/LoginLogs`);
  }

  doLoginUser(username: string, tokens: string) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }


  private storeTokens(tokens: string) {

    localStorage.setItem(this.JWT_TOKEN, tokens);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  chagneHeaderNav(data: HeaderMenu) {
    this.headernav.next(data);
  }

  getActivityLogs(data: any) {
    return this.http.post(
      `${environment.apiUrl}User/GetUserActivity`,
      data
    );
  }
  logoutUserWhenTokenExpired() {

    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}