import { Component, OnInit } from '@angular/core';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { ExceptionServiceService } from 'src/app/Service/exception-service.service';
export interface EventCount {
  newEvents: number;
  weeklyEvents: number;
  monthlyEvents: number;
  yearlyEvents: number;
  singleEvents: number;
  threeEvents: number;
  ltEvents: number;
  htEvents: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  eventType: string = 'Today';
  eventCount: EventCount = {
    monthlyEvents: 0,
    newEvents: 0,
    weeklyEvents: 0,
    yearlyEvents: 0,
    htEvents: 0,
    ltEvents: 0,
    singleEvents: 0,
    threeEvents: 0,
  };
  datas: HeaderMenu = {
    firstlevel: 'Exception',
    levelurl: '',
    menuname: 'Dashboard',
    url: '/mdm/exception/',
  };
  constructor(
    private authservice: AuthService,
    private service: ExceptionServiceService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.getEventCount();
  }

  changeEventType(eventType: string) {
    this.eventType = eventType;
  }
  getEventCount() {
    this.service.getEventsCount().subscribe(
      (res: any) => {
        if (res.success) {
          this.eventCount = res.data;
        }
      },
      (err) => {}
    );
  }
}
