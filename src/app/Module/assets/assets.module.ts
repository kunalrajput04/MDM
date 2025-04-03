import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from 'src/app/Views/Assets/dashboard/dashboard.component';
import { SubstationComponent } from 'src/app/Views/Assets/substation/substation.component';

import { FeederComponent } from 'src/app/Views/Assets/feeder/feeder.component';
import { DtComponent } from 'src/app/Views/Assets/dt/dt.component';
import { DataTablesModule } from 'angular-datatables';
import { DeviceComponent } from '../../Views/Assets/device/device.component';

import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SubdivisionComponent } from 'src/app/Views/Assets/subdivision/subdivision.component';
import { InventoryComponent } from 'src/app/Views/Assets/inventory/inventory.component';
import { InventoryMeterComponent } from 'src/app/Views/Assets/inventory-meter/inventory-meter.component';
import { PhysicalStockComponent } from 'src/app/Views/Assets/physical-stock/physical-stock.component';
import { ReturnMeterComponent } from 'src/app/Views/Assets/return-meter/return-meter.component';
import { AgGridModule } from 'ag-grid-angular';
import { FaultyDamageMeterComponent } from '../../Views/Assets/faulty-damage-meter/faulty-damage-meter.component';
import { InstalledMetersComponent } from '../../Views/Assets/installed-meters/installed-meters.component';
import { NewMetersComponent } from '../../Views/Assets/new-meters/new-meters.component';
import { OldMetersComponent } from '../../Views/Assets/old-meters/old-meters.component';
import { InstalledMeterSummaryComponent } from 'src/app/Views/Assets/installed-meter-summary/installed-meter-summary.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    DashboardComponent,
    SubstationComponent,
    SubdivisionComponent,
    FeederComponent,
    DtComponent,
    DeviceComponent,
    InventoryComponent,
    InventoryMeterComponent,
    PhysicalStockComponent,
    ReturnMeterComponent,
    FaultyDamageMeterComponent,
    InstalledMetersComponent,
    NewMetersComponent,
    OldMetersComponent,
    InstalledMeterSummaryComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    DataTablesModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    AgGridModule.withComponents([]),
    NgApexchartsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AssetsModule {}
