import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCommComponent } from 'src/app/Views/Communication/all-comm/all-comm.component';
import { AllCommandLogComponent } from 'src/app/Views/Communication/all-command-log/all-command-log.component';
import { CommReportComponent } from 'src/app/Views/Communication/comm-report/comm-report.component';
import { CommandLogsComponent } from 'src/app/Views/Communication/command-logs/command-logs.component';
import { CommunicatingMeterComponent } from 'src/app/Views/Communication/communicating-meter/communicating-meter.component';
import { ConfigurationReportComponent } from 'src/app/Views/Communication/configuration-report/configuration-report.component';
import { ConnectDisconnectLogComponent } from 'src/app/Views/Communication/connect-disconnect-log/connect-disconnect-log.component';
import { FirmwareLogComponent } from 'src/app/Views/Communication/firmware-log/firmware-log.component';
import { FullConfigLogComponent } from 'src/app/Views/Communication/full-config-log/full-config-log.component';
import { MetersummeryComponent } from 'src/app/Views/Communication/metersummery/metersummery.component';
import { NamePlateComponent } from 'src/app/Views/Communication/name-plate/name-plate.component';
import { NeverCommunicatingMeterComponent } from 'src/app/Views/Communication/never-communicating-meter/never-communicating-meter.component';
import { NonCommunicatingMeterComponent } from 'src/app/Views/Communication/non-communicating-meter/non-communicating-meter.component';
import { NonCommunicatingComponent } from 'src/app/Views/Communication/non-communicating/non-communicating.component';
import { SLAHistoryComponent } from 'src/app/Views/Communication/sla-history/sla-history.component';
import { SmsLogComponent } from 'src/app/Views/Communication/sms-log/sms-log.component';
import { SyatemSLAHistoryComponent } from 'src/app/Views/Communication/syatem-slahistory/syatem-slahistory.component';
import { SystemAttComponent } from 'src/app/Views/Communication/system-att/system-att.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: CommReportComponent },
  { path: 'all', pathMatch: 'full', component: AllCommComponent },
  { path: 'nameplate', pathMatch: 'full', component: NamePlateComponent },
  { path: 'exceptionlog', pathMatch: 'full', component: NonCommunicatingComponent },
  { path: 'configreport', pathMatch: 'full', component: ConfigurationReportComponent },
  { path: 'allcommand', pathMatch: 'full', component: AllCommandLogComponent },
  { path: 'smslog', pathMatch: 'full', component: SmsLogComponent }, 
  { path: 'commandlog', pathMatch: 'full', component: CommandLogsComponent }, 
  { path: 'firmwarelog', pathMatch: 'full', component: FirmwareLogComponent }, 
  { path: 'fullconfiglog', pathMatch: 'full', component: FullConfigLogComponent }, 
  { path: 'connectlog', pathMatch: 'full', component: ConnectDisconnectLogComponent, data :{ type:"Connect"} }, 
  { path: 'disconnectlog', pathMatch: 'full', component: ConnectDisconnectLogComponent, data :{ type:"DisConnect"} }, 
  { path: 'systemSLAHistory', pathMatch: 'full', component: SyatemSLAHistoryComponent }, 
  { path: 'SLAHistory', pathMatch: 'full', component: SLAHistoryComponent }, 
  {path:'systemAtt',pathMatch:'full',component:SystemAttComponent},
  {path:'communicatingmeter',pathMatch:'full',component:CommunicatingMeterComponent},
  {path:'noncommunicatingmeter',pathMatch:'full',component:NonCommunicatingMeterComponent},
  {path:'nevercommunicatingmeter',pathMatch:'full',component:NeverCommunicatingMeterComponent},
  {path:'metersummery',pathMatch:'full',component:MetersummeryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
