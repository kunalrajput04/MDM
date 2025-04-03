import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRuleComponent } from 'src/app/Views/Vee/add-rule/add-rule.component';
import { VeeAdminDashboardComponent } from 'src/app/Views/Vee/Admin-Dashboard/vee-admin-dashboard/vee-admin-dashboard.component';
import { AppliedRulessComponent } from 'src/app/Views/Vee/applied-ruless/applied-ruless.component';
import { RuleListComponent } from 'src/app/Views/Vee/rule-list/rule-list.component';
import { UpdateRuleComponent } from 'src/app/Views/Vee/update-rule/update-rule.component';
import { MonthlyValidatioEngineComponent } from 'src/app/Views/Vee/Validation/monthly-validatio-engine/monthly-validatio-engine.component';
import { DailyValidatioEngineComponent } from 'src/app/Views/Vee/Validation/daily-validatio-engine/daily-validatio-engine.component';
import { ValidationRuleComponent } from 'src/app/Views/Vee/Configuration/validation-rule/validation-rule.component';
import { CreateValidationRuleComponent } from 'src/app/Views/Vee/Configuration/create-validation-rule/create-validation-rule.component';
import { EstimationRuleComponent } from 'src/app/Views/Vee/Configuration/estimation-rule/estimation-rule/estimation-rule.component';
import { CreateEstimationRuleComponent } from 'src/app/Views/Vee/Configuration/create-estimation-rule/create-estimation-rule/create-estimation-rule.component';
import { DailyEstimationEngComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/daily-estimation-eng.component';
import { MonthlyEstimationEngComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/monthly-estimation-eng.component';
import { PassedReportComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/PassedReport/passed-report/passed-report.component';
import { FailedReportComponent } from 'src/app/Views/Vee/Estimation/monthly-estimation-eng/FailedReport/failed-report/failed-report.component';
import { DailyPassedReportComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/DailyPassedReport/daily-passed-report/daily-passed-report.component';
import { DailyFailedReportComponent } from 'src/app/Views/Vee/Estimation/daily-estimation-eng/DailyFailedReport/daily-failed-report/daily-failed-report.component';
const routes: Routes = [
  {path:'',pathMatch:'full',component:VeeAdminDashboardComponent},
  {path:'addrule',pathMatch:'full',component:AddRuleComponent},
  {path:'updaterule/:name',pathMatch:'full',component:UpdateRuleComponent},
  {path:'appliedrules/:name',pathMatch:'full',component:AppliedRulessComponent},
  {path:'veeAdminDashboard', pathMatch:'full',component:VeeAdminDashboardComponent},
  {path:'MonthlyValidation', pathMatch:'full', component:MonthlyValidatioEngineComponent},
  {path:'DaliyValidation', pathMatch:'full', component:DailyValidatioEngineComponent},
    {path:'validationRule', pathMatch:'full', component:ValidationRuleComponent},
    {path:'createValidationRule', pathMatch:'full', component:CreateValidationRuleComponent},
    {path:'estimationRule', pathMatch:'full', component:EstimationRuleComponent},
    {path:'createestimationrule', pathMatch:'full', component:CreateEstimationRuleComponent},
    {path:'EditValidationRule', pathMatch:'full', component:CreateValidationRuleComponent},
    {path:'DaliyEstimation', pathMatch:'full', component:DailyEstimationEngComponent},
    {path:'MonthlyEstimation', pathMatch:'full', component:MonthlyEstimationEngComponent},
    {path : 'EditestimationRule', pathMatch:'full', component:CreateEstimationRuleComponent},
    {path:'passedReport', pathMatch:'full', component:PassedReportComponent},
    {path:'failedReport', pathMatch:'full', component:FailedReportComponent},
    {path:'passedDailyReport', pathMatch:'full', component:DailyPassedReportComponent},
    {path:'failedDailyReport', pathMatch:'full', component:DailyFailedReportComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeeRoutingModule { }
