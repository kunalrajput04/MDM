import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComparisonComponent } from 'src/app/Views/EnergyAudit/data-comparison/data-comparison.component';
import { EnergyLossComponent } from 'src/app/Views/EnergyAudit/energy-loss/energy-loss.component';
import { ForecastingComponent } from 'src/app/Views/EnergyAudit/forecasting/forecasting.component';
import { ManagementComponent } from 'src/app/Views/EnergyAudit/management/management.component';
import { DataAnalysisComponent } from 'src/app/Views/MeterData/data-analysis/data-analysis.component';
import { DashboardenergyComponent } from 'src/app/Views/EnergyAudit/dashboardenergy/dashboardenergy.component';
import { DlpComponent } from 'src/app/Views/EnergyAudit/dlp/dlp.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardenergyComponent },
  { path: 'dashboard', pathMatch: 'full', component: DashboardenergyComponent },
  { path: 'analysis', pathMatch: 'full', component: DataAnalysisComponent },
  { path: 'management', pathMatch: 'full', component: ManagementComponent },
  { path: 'forecasting', pathMatch: 'full', component: ForecastingComponent },
  { path: 'loss', pathMatch: 'full', component: EnergyLossComponent },
  { path: 'dataComparison', pathMatch: 'full', component: DataComparisonComponent },
  { path: 'dlp', pathMatch: 'full', component:  DlpComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnergyModuleRoutingModule {}
