import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryMeterComponent } from 'src/app/Views/Assets/inventory-meter/inventory-meter.component';
import { RevenueComponent } from 'src/app/Views/revenue/revenue.component';
import { PrepaidDailySummaryComponent } from 'src/app/Views/RevenueManagement/prepaid-daily-summary/prepaid-daily-summary.component';
import { PrepaidHistoryComponent } from 'src/app/Views/RevenueManagement/prepaid-history/prepaid-history.component';
import { PrepaidPaymentComponent } from 'src/app/Views/RevenueManagement/prepaid-payment/prepaid-payment.component';
import { PrepaidStatsComponent } from 'src/app/Views/RevenueManagement/prepaid-stats/prepaid-stats.component';
import { PrepaidUserInfoComponent } from 'src/app/Views/RevenueManagement/prepaid-user-info/prepaid-user-info.component';
import { RevenueGraphComponent } from 'src/app/Views/RevenueManagement/revenue-graph/revenue-graph.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: RevenueComponent },
  { path: 'revenue', pathMatch: 'full', component: RevenueComponent },
  { path: 'history', pathMatch: 'full', component: PrepaidHistoryComponent },
  { path: 'userInfo/:cno', pathMatch: 'full', component: PrepaidUserInfoComponent },
  { path: 'RechargeHistory', pathMatch: 'full', component: PrepaidPaymentComponent },
  { path: 'stats/:cno', pathMatch: 'full', component: PrepaidStatsComponent },
  { path: 'graph', pathMatch: 'full', component: RevenueGraphComponent },
  { path: 'payment', pathMatch: 'full', component: PrepaidPaymentComponent },
  { path: 'dailysummary', pathMatch: 'full', component: PrepaidDailySummaryComponent },

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevenueRoutingModule { }
