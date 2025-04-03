import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomGuard } from './Guards/random.guard';
import { LayoutComponent } from './Shared/layout/layout.component';
import { NotfoundComponent } from './Shared/notfound/notfound.component';
import { HomeComponent } from './Views/home/home.component';
import { LoginComponent } from './Views/login/login.component';
import { MdmModulesComponent } from './Views/mdm-modules/mdm-modules.component';

const routes: Routes = [
  {
    path: '',canActivate: [RandomGuard],
    loadChildren: () =>
      import('../app/Module/selection/selection.module').then((m) => m.SelectionModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../app/Module/authentication/authentication.module').then((m) => m.AuthenticationModule),
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
