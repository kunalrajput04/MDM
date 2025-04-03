import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationRoutingModule } from './communication-routing.module';
import { CommReportComponent } from '../../Views/Communication/comm-report/comm-report.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommComponent } from '../../Views/Communication/all-comm/all-comm.component';
import { NamePlateComponent } from '../../Views/Communication/name-plate/name-plate.component';
import { NonCommunicatingComponent } from '../../Views/Communication/non-communicating/non-communicating.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigurationReportComponent } from '../../Views/Communication/configuration-report/configuration-report.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllCommandLogComponent } from '../../Views/Communication/all-command-log/all-command-log.component';
import { SmsLogComponent } from '../../Views/Communication/sms-log/sms-log.component';
import { CommandLogsComponent } from '../../Views/Communication/command-logs/command-logs.component';
import { CommandLogChartComponent } from '../../Views/Communication/command-log-chart/command-log-chart.component';
import { FirmwareLogComponent } from '../../Views/Communication/firmware-log/firmware-log.component';
import { FullConfigLogComponent } from '../../Views/Communication/full-config-log/full-config-log.component';
import { ConnectDisconnectLogComponent } from '../../Views/Communication/connect-disconnect-log/connect-disconnect-log.component';
import { SyatemSLAHistoryComponent } from 'src/app/Views/Communication/syatem-slahistory/syatem-slahistory.component';
import { MySLACellComponent } from 'src/app/Views/Communication/syatem-slahistory/SLA_CEll';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SLAHistoryComponent } from 'src/app/Views/Communication/sla-history/sla-history.component';
import { MySLAHistoryCellComponent } from 'src/app/Views/Communication/sla-history/SLA_History_Cell';
import { SystemAttComponent } from 'src/app/Views/Communication/system-att/system-att.component';
import { CommunicatingMeterComponent } from 'src/app/Views/Communication/communicating-meter/communicating-meter.component';
import { CommunicationmeterService } from 'src/app/Service/communicationmeter.service';
import { NonCommunicatingMeterComponent } from 'src/app/Views/Communication/non-communicating-meter/non-communicating-meter.component';
import { NeverCommunicatingMeterComponent } from 'src/app/Views/Communication/never-communicating-meter/never-communicating-meter.component';
import { MetersummeryComponent } from 'src/app/Views/Communication/metersummery/metersummery.component';

@NgModule({
  declarations: [
    CommReportComponent,
    AllCommComponent,
    NamePlateComponent,
    NonCommunicatingComponent,
    ConfigurationReportComponent,
    AllCommandLogComponent,
    SmsLogComponent,
    CommandLogsComponent,
    CommandLogChartComponent,
    FirmwareLogComponent,
    FullConfigLogComponent,
    ConnectDisconnectLogComponent,
    SyatemSLAHistoryComponent,
    MySLACellComponent,
    SLAHistoryComponent,
    MySLAHistoryCellComponent,
    SystemAttComponent,
    CommunicatingMeterComponent,
    NonCommunicatingMeterComponent,
    NeverCommunicatingMeterComponent,
    MetersummeryComponent
  ],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    NgApexchartsModule,
    FormsModule,
    DataTablesModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    AgGridModule.withComponents([]),
    NgSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [
    CommunicationmeterService
  ]
})
export class CommunicationModule { }
