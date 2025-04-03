import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingDataComponent } from 'src/app/Views/MeterData/billing-data/billing-data.component';
import { DailyLpdComponent } from 'src/app/Views/MeterData/daily-lpd/daily-lpd.component';

import { EventDataComponent } from 'src/app/Views/MeterData/event-data/event-data.component';
import { InstantDataComponent } from 'src/app/Views/MeterData/instant-data/instant-data.component';
import { LoadDataComponent } from 'src/app/Views/MeterData/load-data/load-data.component';
import { OnDemandLogComponent } from 'src/app/Views/MeterData/on-demand-log/on-demand-log.component';
import { OnDemandComponent } from 'src/app/Views/MeterData/on-demand/on-demand.component';



const routes: Routes = [
  {path:'',pathMatch:'full',component:InstantDataComponent},
  {path:'dailylpd',pathMatch:'full',component:DailyLpdComponent},
  {path:'loaddata',pathMatch:'full',component:LoadDataComponent},
  {path:'billingdata',pathMatch:'full',component:BillingDataComponent},
  
  {path:'event',pathMatch:'full',component:EventDataComponent},
  {path:'ondemand',pathMatch:'full',component:OnDemandComponent},
  {path:'ondemandlog',pathMatch:'full',component:OnDemandLogComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeterDataRoutingModule { }
