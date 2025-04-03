import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailySummaryComponent } from 'src/app/Views/PrepaidService/daily-summary/daily-summary.component';
import { LowBalanceConsumerComponent } from 'src/app/Views/PrepaidService/low-balance-consumer/low-balance-consumer.component';
import { MonthlySummaryComponent } from 'src/app/Views/PrepaidService/monthly-summary/monthly-summary.component';
import { NewRechargeComponent } from 'src/app/Views/PrepaidService/new-recharge/new-recharge.component';
import { CreateComponent } from 'src/app/Views/PrepaidService/NewTarrif/create/create.component';
import { NewTarrifListComponent } from 'src/app/Views/PrepaidService/NewTarrif/new-tarrif-list/new-tarrif-list.component';
import { UpdateComponent } from 'src/app/Views/PrepaidService/NewTarrif/update/update.component';
import { PrepaidConsumerComponent } from 'src/app/Views/PrepaidService/prepaid-consumer/prepaid-consumer.component';
import { RechargeHistoryComponent } from 'src/app/Views/PrepaidService/recharge-history/recharge-history.component';
import { UpdateRechargeComponent } from 'src/app/Views/PrepaidService/update-recharge/update-recharge.component';

const routes: Routes = [

  {path:'',pathMatch:'full',component:PrepaidConsumerComponent},  
  {path:'consumers',pathMatch:'full',component:PrepaidConsumerComponent},  
  {path:'dailySummary',pathMatch:'full',component:DailySummaryComponent},
  {path:'monthlySummary',pathMatch:'full',component:MonthlySummaryComponent},
  {path:'rechargeHistory',pathMatch:'full',component:RechargeHistoryComponent},
  {path:'newRecharge',pathMatch:'full',component:NewRechargeComponent},
  {path:'updateRecharge/:id',pathMatch:'full',component:UpdateRechargeComponent},
  {path:'lowbalance',pathMatch:'full',component:LowBalanceConsumerComponent},
  {path:'newTarrif',pathMatch:'full',component:NewTarrifListComponent},
  {path:'AddTarrif',pathMatch:'full',component:CreateComponent},
  {path:'UpdateTarrif/:id',pathMatch:'full',component:UpdateComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrepaidServiceRoutingModule { }
