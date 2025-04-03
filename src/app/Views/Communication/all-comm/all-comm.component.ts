import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDashboardChartComman } from 'src/app/Model/dash-board';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';
@Component({
  selector: 'app-all-comm',
  templateUrl: './all-comm.component.html',
  styleUrls: ['./all-comm.component.css']
})

export class AllCommComponent implements OnInit {

  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'All Communication',
    url: 'mdm/communication',
  };


  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  commRead: any[] = [0, 0, 0, 0];
  instantRead: any[] = [0, 0, 0, 0];
  dlpRead: any[] = [0, 0, 0, 0];
  lpRead: any[] = [0, 0, 0, 0];
  billingRead: any[] = [0, 0, 0, 0];
  eventRead: any[] = [0, 0, 0, 0];
  dashboardChartComman: IDashboardChartComman;

  constructor(
    private chartservice: DataService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {

    if (sessionStorage.getItem("communicationsummary") === null) {
      this.getDashboardChartComman();
    }
    else
      this.setChartData();

  }


  getDashboardChartComman() {

    this.chartservice.getDashboardChartComman().subscribe((res: any) => {
      if (res.data != null) {
        this.dashboardChartComman = res.data[0];
        sessionStorage.setItem(
          'communicationsummary',
          JSON.stringify(res.data[0])
        );
        this.setChartData();
      }
    });
  }
  setChartData() {

    this.dashboardChartComman = JSON.parse(
      sessionStorage.getItem('communicationsummary')
    );
    let MeterTotal =
      this.dashboardChartComman.singlephasemeters +
      this.dashboardChartComman.threephasemeters +
      this.dashboardChartComman.ctmeters;

    this.chartOptions = {
      chart: {
        height: 200,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '18px',
            },
            value: {
              show: true,
              fontSize: '10px',
              fontFamily: undefined,
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val) {
                return val + '%';
              },
            },
            total: {
              show: true,
              label: 'Total',
              color: '#373d3f',

              fontSize: '16px',
              fontFamily: undefined,
              fontWeight: 600,
              formatter: function (w) {
                return MeterTotal + '';
              },
            },
          },
          hollow: {
            size: '50%',
            background: 'transparent',
            position: 'front',
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },
        },
      },

      labels: ['Last Month', 'Last Week', 'Last Day', 'Today', 'Inactive'],
    };

    this.commRead = [
      (
        Math.round(this.dashboardChartComman.commmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.commweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.commyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.commdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.instantRead = [
      (
        Math.round(this.dashboardChartComman.instantmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.instantweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.instantyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.instantdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.dlpRead = [
      (
        Math.round(this.dashboardChartComman.dailymonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.dailyweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.dailyyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.dailydaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.lpRead = [
      (
        Math.round(this.dashboardChartComman.deltamonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.deltaweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.deltayestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.deltadaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.billingRead = [
      (
        Math.round(this.dashboardChartComman.billingmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.billingweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.billingyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.billingdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.eventRead = [
      (
        Math.round(this.dashboardChartComman.eventmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.eventweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.eventyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.eventdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
  }
}

