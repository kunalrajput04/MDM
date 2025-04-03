import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevenueRoutingModule } from './revenue-routing.module';
import { RevenueComponent } from 'src/app/Views/revenue/revenue.component';
import { Routes } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrepaidHistoryComponent } from 'src/app/Views/RevenueManagement/prepaid-history/prepaid-history.component';
import { PrepaidUserInfoComponent } from 'src/app/Views/RevenueManagement/prepaid-user-info/prepaid-user-info.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PrepaidStatsComponent } from 'src/app/Views/RevenueManagement/prepaid-stats/prepaid-stats.component';
import { PrepaidPaymentComponent } from 'src/app/Views/RevenueManagement/prepaid-payment/prepaid-payment.component';
import { RevenueGraphComponent } from 'src/app/Views/RevenueManagement/revenue-graph/revenue-graph.component';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { PrepaidDailySummaryComponent } from 'src/app/Views/RevenueManagement/prepaid-daily-summary/prepaid-daily-summary.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    RevenueComponent,
    PrepaidHistoryComponent,
    PrepaidUserInfoComponent,
    PrepaidStatsComponent,
    PrepaidPaymentComponent,
    RevenueGraphComponent,
    PrepaidDailySummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RevenueRoutingModule,
    LeafletModule,
    NgApexchartsModule,
    LeafletMarkerClusterModule,
    AgGridModule
  ],
})
export class RevenueModule {}
