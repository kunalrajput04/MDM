import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExceptionRoutingModule } from './exception-routing.module';
import { ExceptionComponent } from '../../Views/Exception/exception/exception.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ExceptionChartComponent } from '../../Views/Exception/exception-chart/exception-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardComponent } from '../../Views/Exception/dashboard/dashboard.component';
import { TodayEventsComponent } from '../../Views/Exception/today-events/today-events.component';
import { WeeklyEventsComponent } from '../../Views/Exception/weekly-events/weekly-events.component';
import { MonthlyEventsComponent } from '../../Views/Exception/monthly-events/monthly-events.component';

import { AgGridModule } from 'ag-grid-angular';
import { HealthLogComponent } from '../../Views/Exception/health-log/health-log.component';
import { NewEventsComponent } from '../../Views/Exception/new-events/new-events.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CriticalEventsLogComponent } from '../../Views/Exception/critical-events-log/critical-events-log.component';
import { CriticalEventsTicketsComponent } from '../../Views/Exception/critical-events-tickets/critical-events-tickets.component';
import { DetailsEventsTicketsComponent } from '../../Views/Exception/details-events-tickets/details-events-tickets.component';
import { AlarmEventsComponent } from '../../Views/Exception/alarm-events/alarm-events.component';


@NgModule({
  declarations: [
    ExceptionComponent,
    ExceptionChartComponent,
    DashboardComponent,
    TodayEventsComponent,
    WeeklyEventsComponent,
    MonthlyEventsComponent,
    HealthLogComponent,
    NewEventsComponent,
    CriticalEventsLogComponent,
    CriticalEventsTicketsComponent,
    DetailsEventsTicketsComponent,
    AlarmEventsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    ExceptionRoutingModule,
    NgApexchartsModule,
    AgGridModule.withComponents([]),
    NgSelectModule
  ]
})
export class ExceptionModule { }
