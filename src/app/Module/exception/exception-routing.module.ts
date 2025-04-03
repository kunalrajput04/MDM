import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlarmEventsComponent } from 'src/app/Views/Exception/alarm-events/alarm-events.component';
import { CriticalEventsLogComponent } from 'src/app/Views/Exception/critical-events-log/critical-events-log.component';
import { CriticalEventsTicketsComponent } from 'src/app/Views/Exception/critical-events-tickets/critical-events-tickets.component';
import { DashboardComponent } from 'src/app/Views/Exception/dashboard/dashboard.component';
import { DetailsEventsTicketsComponent } from 'src/app/Views/Exception/details-events-tickets/details-events-tickets.component';
import { ExceptionChartComponent } from 'src/app/Views/Exception/exception-chart/exception-chart.component';
import { ExceptionComponent } from 'src/app/Views/Exception/exception/exception.component';
import { HealthLogComponent } from 'src/app/Views/Exception/health-log/health-log.component';
import { NewEventsComponent } from 'src/app/Views/Exception/new-events/new-events.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'chart', pathMatch: 'full', component: ExceptionChartComponent },
  { path: 'event', pathMatch: 'full', component: ExceptionComponent },
  { path: 'healthlog', pathMatch: 'full', component: HealthLogComponent },
  { path: 'newevents', pathMatch: 'full', component: NewEventsComponent },
  { path: 'alarmevents', pathMatch: 'full', component: AlarmEventsComponent },
  {
    path: 'critical',
    pathMatch: 'full',
    component: CriticalEventsLogComponent,
  },
  {
    path: 'tickets',
    pathMatch: 'full',
    component: CriticalEventsTicketsComponent,
  },
  {
    path: 'details/:id',
    pathMatch: 'full',
    component: DetailsEventsTicketsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExceptionRoutingModule {}
