import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeeRoutingModule } from './vee-routing.module';
import { RuleListComponent } from '../../Views/Vee/rule-list/rule-list.component';
import { DataTablesModule } from 'angular-datatables';
import { AddRuleComponent } from '../../Views/Vee/add-rule/add-rule.component';
import { UpdateRuleComponent } from '../../Views/Vee/update-rule/update-rule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppliedRulessComponent } from 'src/app/Views/Vee/applied-ruless/applied-ruless.component';
import { AgGridModule } from 'ag-grid-angular';
import { VeeAdminDashboardComponent } from 'src/app/Views/Vee/Admin-Dashboard/vee-admin-dashboard/vee-admin-dashboard.component';
import { MonthlyValidatioEngineComponent } from 'src/app/Views/Vee/Validation/monthly-validatio-engine/monthly-validatio-engine.component';
import { DailyValidatioEngineComponent } from 'src/app/Views/Vee/Validation/daily-validatio-engine/daily-validatio-engine.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import { ValidationRuleComponent } from 'src/app/Views/Vee/Configuration/validation-rule/validation-rule.component';
import { CreateValidationRuleComponent } from 'src/app/Views/Vee/Configuration/create-validation-rule/create-validation-rule.component';
import { UiSwitchModule } from 'ngx-ui-switch'; 
import { EstimationRuleComponent } from 'src/app/Views/Vee/Configuration/estimation-rule/estimation-rule/estimation-rule.component';
import { CreateEstimationRuleComponent } from 'src/app/Views/Vee/Configuration/create-estimation-rule/create-estimation-rule/create-estimation-rule.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { DialogElementComponent } from 'src/app/Views/Vee/Configuration/my-cell/dialog-element/dialog-element.component';
import { DialogRuleComponent } from 'src/app/Views/Vee/Validation/dialog-rule/dialog-rule.component';
import {MatIconModule} from '@angular/material/icon';
import { MyCellComponent } from 'src/app/Views/Vee/Configuration/my-cell/my-cell.component';
import { MyDailyCellComponent } from 'src/app/Views/Vee/Validation/dailyCell/dailyCell';

import { MonthlyBillingRuleComponent } from 'src/app/Views/Vee/Validation/daily-Billing-Dialog/monthly-billing-rule/monthly-billing-rule.component';
import { MyMonthlyCellComponent } from 'src/app/Views/Vee/Validation/Monthly-Download-cell/monthlyCell';
import { MonthlyEstimationEngComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/monthly-estimation-eng.component';
import { DailyEstimationEngComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/daily-estimation-eng.component';
import { MyESTCellComponent } from 'src/app/Views/Vee/Configuration/estimation-rule/estimation-rule/estimationCell.component';
import { MyMonthlyESTCellComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/MEstCell.component';
import { PassedReportComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/PassedReport/passed-report/passed-report.component';
import { FailedReportComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/FailedReport/failed-report/failed-report.component';
import { MyDailyESTCellComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/DailyEstCell.component';
import { DailyPassedReportComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/DailyPassedReport/daily-passed-report/daily-passed-report.component';
import { DailyFailedReportComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/DailyFailedReport/daily-failed-report/daily-failed-report.component';

@NgModule({
  declarations: [
    RuleListComponent,
    AddRuleComponent,
    UpdateRuleComponent,
    AppliedRulessComponent,
    VeeAdminDashboardComponent,
    MonthlyValidatioEngineComponent,
    DailyValidatioEngineComponent,
    ValidationRuleComponent,
    CreateValidationRuleComponent,
    EstimationRuleComponent,
    CreateEstimationRuleComponent,
    DialogElementComponent,
    DialogRuleComponent,
    MyCellComponent,
    MyDailyCellComponent,
    MyMonthlyCellComponent,
    MonthlyBillingRuleComponent,
    MonthlyEstimationEngComponent,
    DailyEstimationEngComponent,
    MyESTCellComponent,
    MyMonthlyESTCellComponent,
    PassedReportComponent,
    FailedReportComponent,
    MyDailyESTCellComponent,
    DailyPassedReportComponent,
    DailyFailedReportComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    VeeRoutingModule,
    AgGridModule,
    MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    UiSwitchModule.forRoot({
      size: 'medium',
      color: '#79B6B9',
      switchColor: '#008B8B',
      defaultBgColor: '#ced4da',
      defaultBoColor : '#CBCBCB',
      checkedLabel: '',
      uncheckedLabel: ''
    })
  ]
})
export class VeeModule { }
