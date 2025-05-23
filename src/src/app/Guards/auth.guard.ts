import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    return !this.authService.isLoggedIn();
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }
}
