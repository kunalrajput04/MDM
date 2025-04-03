import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../Service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private authservice: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    
    return next.handle(request).pipe(
      map(resp => {
        if (resp instanceof HttpResponse) {
          this.spinner.hide();
          if (resp.body.message == 'Key Is Not Valid' || resp.body.message == 'Session Is Expired') {
            this.authservice.logoutUserWhenTokenExpired();
          }
          else {
            if (resp.body.apiKey != null && resp.body.apiKey != undefined)
              localStorage.setItem('apikey', resp.body.apiKey);
          }
        }
        return resp;
      })


    );


  }
}
