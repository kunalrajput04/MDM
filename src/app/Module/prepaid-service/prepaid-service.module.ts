import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrepaidServiceRoutingModule } from './prepaid-service-routing.module';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { DailySummaryComponent } from 'src/app/Views/PrepaidService/daily-summary/daily-summary.component';
import { MonthlySummaryComponent } from 'src/app/Views/PrepaidService/monthly-summary/monthly-summary.component';
import { RechargeHistoryComponent } from 'src/app/Views/PrepaidService/recharge-history/recharge-history.component';
import { NewRechargeComponent } from 'src/app/Views/PrepaidService/new-recharge/new-recharge.component';
import { UpdateRechargeComponent } from 'src/app/Views/PrepaidService/update-recharge/update-recharge.component';
import { PrepaidConsumerComponent } from 'src/app/Views/PrepaidService/prepaid-consumer/prepaid-consumer.component';
import { LowBalanceConsumerComponent } from 'src/app/Views/PrepaidService/low-balance-consumer/low-balance-consumer.component';
import { NewTarrifListComponent } from 'src/app/Views/PrepaidService/NewTarrif/new-tarrif-list/new-tarrif-list.component';
import { CreateComponent } from 'src/app/Views/PrepaidService/NewTarrif/create/create.component';
import { UpdateComponent } from 'src/app/Views/PrepaidService/NewTarrif/update/update.component';


@NgModule({
  declarations: [
   DailySummaryComponent,
   MonthlySummaryComponent,
   RechargeHistoryComponent,
   NewRechargeComponent,
   UpdateRechargeComponent,
   PrepaidConsumerComponent,
   LowBalanceConsumerComponent,
   NewTarrifListComponent,
   CreateComponent,
   UpdateComponent    
  ],
  imports: [
    CommonModule,
    PrepaidServiceRoutingModule,
    NgSelect2Module,
    NgSelectModule,
    DataTablesModule,
    FormsModule,
    AgGridModule
  ]
})
export class PrepaidServiceModule { }
