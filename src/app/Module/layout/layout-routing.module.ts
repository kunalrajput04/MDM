import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomGuard } from 'src/app/Guards/random.guard';
import { ChangePasswordComponent } from 'src/app/Shared/change-password/change-password.component';
import { LayoutComponent } from 'src/app/Shared/layout/layout.component';

const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
     canActivate: [RandomGuard],
    children: [
      { path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule) },
      { path: 'support', loadChildren: () => import('../support/support.module').then(m => m.SupportModule) },
      { path: 'PrepaidService', loadChildren: () => import('../prepaid-service/prepaid-service.module').then(m => m.PrepaidServiceModule) },
      { path: 'consumer', loadChildren: () => import('../consumer/consumer.module').then(m => m.ConsumerModule) },
      { path: 'assets', loadChildren: () => import('../assets/assets.module').then(m => m.AssetsModule) },
      { path: 'meterdata', loadChildren: () => import('../meter-data/meter-data.module').then(m => m.MeterDataModule) },
      { path: 'revenue', loadChildren: () => import('../revenue/revenue.module').then(m => m.RevenueModule) },
      { path: 'prepaid', loadChildren: () => import('../prepaid/prepaid.module').then(m => m.PrepaidModule) },
      { path: 'exception', loadChildren: () => import('../exception/exception.module').then(m => m.ExceptionModule) },
      { path: 'vee', loadChildren: () => import('../vee/vee.module').then(m => m.VeeModule) },
      { path: 'communication', loadChildren: () => import('../communication/communication.module').then(m => m.CommunicationModule) },
      { path: 'energy', loadChildren: () => import('../energy-module/energy-module.module').then(m => m.EnergyModuleModule) },
      { path: 'changepassword', pathMatch: 'full', component: ChangePasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
