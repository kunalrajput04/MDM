import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnergyModuleRoutingModule } from './energy-module-routing.module';
import { DataAnalysisComponent } from 'src/app/Views/MeterData/data-analysis/data-analysis.component';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementComponent } from 'src/app/Views/EnergyAudit/management/management.component';
import { ForecastingComponent } from 'src/app/Views/EnergyAudit/forecasting/forecasting.component';
import { EnergyLossComponent } from 'src/app/Views/EnergyAudit/energy-loss/energy-loss.component';
import { DataComparisonComponent } from 'src/app/Views/EnergyAudit/data-comparison/data-comparison.component';
import { DlpComponent } from 'src/app/Views/EnergyAudit/dlp/dlp.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    DataAnalysisComponent,
    ManagementComponent,
    ForecastingComponent,
    EnergyLossComponent,
    DataComparisonComponent,DlpComponent
  ],
  imports: [
    CommonModule,
    EnergyModuleRoutingModule,
    DataTablesModule,
    NgApexchartsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
  ],
})
export class EnergyModuleModule {}
