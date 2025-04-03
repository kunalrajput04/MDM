import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterDataRoutingModule } from './meter-data-routing.module';
import { FormsModule } from '@angular/forms';
import { InstantDataComponent } from 'src/app/Views/MeterData/instant-data/instant-data.component';
import { DailyLpdComponent } from 'src/app/Views/MeterData/daily-lpd/daily-lpd.component';
import { LoadDataComponent } from 'src/app/Views/MeterData/load-data/load-data.component';
import { BillingDataComponent } from 'src/app/Views/MeterData/billing-data/billing-data.component';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';

import { EventDataComponent } from 'src/app/Views/MeterData/event-data/event-data.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { OnDemandComponent } from '../../Views/MeterData/on-demand/on-demand.component';
import { OnDemandLogComponent } from '../../Views/MeterData/on-demand-log/on-demand-log.component';

@NgModule({
  declarations: [
    InstantDataComponent,
    DailyLpdComponent,
    LoadDataComponent,
    BillingDataComponent,

    EventDataComponent,
    OnDemandComponent,
    OnDemandLogComponent,
  ],
  imports: [
    CommonModule,
    MeterDataRoutingModule,
    FormsModule,
    DataTablesModule,
    AgGridModule.withComponents([]),
    NgApexchartsModule,
    NgSelectModule,
  ],
})
export class MeterDataModule {}
