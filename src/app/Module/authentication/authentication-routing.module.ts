import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/Views/forgot-password/forgot-password.component';
import { LoginComponent } from 'src/app/Views/login/login.component';

const routes: Routes = [
   { path: 'login', pathMatch: 'full', component: LoginComponent },
   { path: 'forgotpassword', pathMatch: 'full', component: ForgotPasswordComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
