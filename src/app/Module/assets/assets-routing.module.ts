import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/Views/Assets/dashboard/dashboard.component';
import { DeviceComponent } from 'src/app/Views/Assets/device/device.component';
import { DtComponent } from 'src/app/Views/Assets/dt/dt.component';
import { FaultyDamageMeterComponent } from 'src/app/Views/Assets/faulty-damage-meter/faulty-damage-meter.component';
import { FeederComponent } from 'src/app/Views/Assets/feeder/feeder.component';
import { InstalledMeterSummaryComponent } from 'src/app/Views/Assets/installed-meter-summary/installed-meter-summary.component';
import { InstalledMetersComponent } from 'src/app/Views/Assets/installed-meters/installed-meters.component';
import { InventoryMeterComponent } from 'src/app/Views/Assets/inventory-meter/inventory-meter.component';
import { InventoryComponent } from 'src/app/Views/Assets/inventory/inventory.component';
import { NewMetersComponent } from 'src/app/Views/Assets/new-meters/new-meters.component';
import { OldMetersComponent } from 'src/app/Views/Assets/old-meters/old-meters.component';
import { PhysicalStockComponent } from 'src/app/Views/Assets/physical-stock/physical-stock.component';
import { SubdivisionComponent } from 'src/app/Views/Assets/subdivision/subdivision.component';
import { SubstationComponent } from 'src/app/Views/Assets/substation/substation.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'subdivision', pathMatch: 'full', component: SubdivisionComponent },
  { path: 'substation', pathMatch: 'full', component: SubstationComponent },
  { path: 'feeder', pathMatch: 'full', component: FeederComponent },
  { path: 'dt', pathMatch: 'full', component: DtComponent },
  { path: 'device', pathMatch: 'full', component: DeviceComponent },
  { path: 'Inventory', pathMatch: 'full', component: InventoryComponent },
  {
    path: 'InventoryMeter/:meter',
    pathMatch: 'full',
    component: InventoryMeterComponent,
  },
  { path: 'stock', pathMatch: 'full', component: PhysicalStockComponent },
  {
    path: 'faultymeters',
    pathMatch: 'full',
    component: FaultyDamageMeterComponent,
  },
  {
    path: 'installedmeters',
    pathMatch: 'full',
    component: InstalledMetersComponent,
  },
  {
    path: 'summary',
    pathMatch: 'full',
    component: InstalledMeterSummaryComponent,
  },
  { path: 'newmeters', pathMatch: 'full', component: NewMetersComponent },
  { path: 'oldmeters', pathMatch: 'full', component: OldMetersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
