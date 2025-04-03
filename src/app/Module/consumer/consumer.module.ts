import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerRoutingModule } from './consumer-routing.module';
import { FormsModule } from '@angular/forms';
import { ConsumerInfoViewComponent } from 'src/app/Views/ConsumerInfo/consumer-info-view/consumer-info-view.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ConsumerTypeComponent } from 'src/app/Views/ConsumerInfo/consumer-type/consumer-type.component';
import { ConsumerInfoListComponent } from 'src/app/Views/ConsumerInfo/consumer-info-list/consumer-info-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { DashboardComponent } from '../../Views/ConsumerInfo/dashboard/dashboard.component';
import { ButtonRendererComponent } from '../../Shared/button-renderer/button-renderer.component';

import { MasterSubDivisionComponent } from 'src/app/Views/ConsumerInfo/master-sub-division/master-sub-division.component';
import { MasterSubStationComponent } from 'src/app/Views/ConsumerInfo/master-sub-station/master-sub-station.component';
import { MasterFeederComponent } from 'src/app/Views/ConsumerInfo/master-feeder/master-feeder.component';
import { MasterDtComponent } from 'src/app/Views/ConsumerInfo/master-dt/master-dt.component';
import { MasterSimdataComponent } from 'src/app/Views/ConsumerInfo/master-simdata/master-simdata.component';
import { MasterCustomerDataComponent } from 'src/app/Views/ConsumerInfo/master-customer-data/master-customer-data.component';
import { NewmeterComponent } from 'src/app/Views/ConsumerInfo/newmeter/newmeter.component';
import {ReportsComponent} from 'src/app/Views/ConsumerInfo/reports/reports.component';
@NgModule({
  declarations: [ConsumerInfoViewComponent,ConsumerTypeComponent,ConsumerInfoListComponent, DashboardComponent, ButtonRendererComponent,
    MasterSubDivisionComponent,
    MasterSubStationComponent,
    MasterFeederComponent,
    MasterDtComponent,
    MasterSimdataComponent,
    MasterCustomerDataComponent,
    NewmeterComponent,ReportsComponent
  ],
  imports: [
    CommonModule,
    ConsumerRoutingModule,
    LeafletModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    AgGridModule.withComponents([]),
  ]
})
export class ConsumerModule { }
