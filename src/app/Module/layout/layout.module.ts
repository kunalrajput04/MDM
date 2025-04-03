import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from 'src/app/Shared/layout/layout.component';
import { SidebarComponent } from 'src/app/Shared/layout/sidebar/sidebar.component';
import { TopBarComponent } from 'src/app/Shared/top-bar/top-bar.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ChangePasswordComponent } from '../../Shared/change-password/change-password.component';
import { FormsModule } from '@angular/forms';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [LayoutComponent,SidebarComponent,TopBarComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    PerfectScrollbarModule,
    FormsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class LayoutModule { }
