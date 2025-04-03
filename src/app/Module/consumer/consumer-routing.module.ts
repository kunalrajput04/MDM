import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerInfoListComponent } from 'src/app/Views/ConsumerInfo/consumer-info-list/consumer-info-list.component';
import { ConsumerInfoViewComponent } from 'src/app/Views/ConsumerInfo/consumer-info-view/consumer-info-view.component';
import { ConsumerTypeComponent } from 'src/app/Views/ConsumerInfo/consumer-type/consumer-type.component';
import { DashboardComponent } from 'src/app/Views/ConsumerInfo/dashboard/dashboard.component';
import { MasterSubDivisionComponent } from 'src/app/Views/ConsumerInfo/master-sub-division/master-sub-division.component';
import { MasterSubStationComponent } from 'src/app/Views/ConsumerInfo/master-sub-station/master-sub-station.component';
import { MasterFeederComponent } from 'src/app/Views/ConsumerInfo/master-feeder/master-feeder.component';
import { MasterDtComponent } from 'src/app/Views/ConsumerInfo/master-dt/master-dt.component';
import { MasterSimdataComponent } from 'src/app/Views/ConsumerInfo/master-simdata/master-simdata.component';
import { MasterCustomerDataComponent } from 'src/app/Views/ConsumerInfo/master-customer-data/master-customer-data.component';
import { NewmeterComponent } from 'src/app/Views/ConsumerInfo/newmeter/newmeter.component';
import {ReportsComponent} from 'src/app/Views/ConsumerInfo/reports/reports.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'ConsumerDetails/:id', pathMatch: 'full', component: ConsumerInfoViewComponent },
  { path: 'consumer/:type', pathMatch: 'full', component: ConsumerTypeComponent },
  {path:'SubDivision',pathMatch:'full',component:MasterSubDivisionComponent},
  {path:'SubStation',pathMatch:'full',component:MasterSubStationComponent},
  {path:'feeder',pathMatch:'full',component:MasterFeederComponent},
  {path:'DT',pathMatch:'full',component:MasterDtComponent},
  {path:'SimData',pathMatch:'full',component:MasterSimdataComponent},
  {path:'CustomerData',pathMatch:'full',component:MasterCustomerDataComponent},
  {path:'NewMeter',pathMatch:'full',component:NewmeterComponent},
  {path:'Reports', pathMatch:'full',component:ReportsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule { }
