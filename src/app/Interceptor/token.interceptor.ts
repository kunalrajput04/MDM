import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../Service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    if (request.url.includes(environment.smartapiUrl)) {
      request = this.addTokenHes(request, this.authService.getJwtToken());
    }
    else {

      if (this.authService.getJwtToken()) {
        request = this.addToken(request, this.authService.getJwtToken());
      }
    }
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        sessionStorage.clear();
        localStorage.clear();
        this.spinner.hide();
        return throwError(error);
      } else {
        this.spinner.hide();
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private addTokenHes(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'apiKey': localStorage.getItem('apikey')
      }
    });
  }

}
