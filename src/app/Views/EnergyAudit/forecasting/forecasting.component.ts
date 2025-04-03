import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

export interface IFilterData {
  fromdate: string;
  todate: string;
  meterNo: string;
  accessLevel: string;
  dataRange: string;
  subdivisonName: string;
  substationName: string;
  feederName: string;
  dtName: string;
}
@Component({
  selector: 'app-forecasting',
  templateUrl: './forecasting.component.html',
  styleUrls: ['./forecasting.component.css'],
})
export class ForecastingComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Energy',
    levelurl: '',
    menuname: 'Energy Forecasting',
    url: '/mdm/vee/',
  };

  formdata: IFilterData = {
    accessLevel: 'CONSUMER',
    dataRange: 'DAILY',
    fromdate: '',
    meterNo: '',
    todate: '',
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
  };
  //#endregion

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  lables: any = [];
  deltalables: any = [];
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  levelValue: string;
  levelName: string;

  constructor(
    private service: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private toastr: ToastrService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    // <!--new energy forcasting -->
    this.chartOptions2 = {
      series: [
        {
          name: 'KVAH',
          type: 'line',
          data: [620, 670, 800, 820, 880],
        },
        {
          name: 'KWH',
          type: 'line',
          data: [230, 300, 414, 610, 790],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      markers: {
        size: [6, 6],
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        position: 'right',
        offsetX: -40,
        offsetY: 30,
        markers: {
          radius: 0,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      colors: ['#26A0FC', '#FEBC3C'],
      title: {
        text: 'Energy',
        style: {
          color: '#964B00',
        },
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: [0, 1],
      },
      labels: [
        '16 May 2001',
        '17 May 2001',
        '18 May 2001',
        '19 May 2001',
        '20 May 2001',
      ],
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: true,
          color: '#808080',
        },
        title: {
          text: 'Date',
          style: {
            color: '#964B00',
          },
        },
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#808080',
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.linechart();
    this.detailed();
  }

  linechart() {
    this.chartOptions = {
      series: [
        {
          name: 'Income',
          type: 'column',
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
        },
        {
          name: 'Cashflow',
          type: 'column',
          data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
        },
        {
          name: 'Revenue',
          type: 'line',
          data: [20, 29, 37, 36, 44, 45, 50, 58],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },
      title: {
        text: 'XYZ - Stock Analysis (2009 - 2016)',
        align: 'left',
        offsetX: 110,
      },
      xaxis: {
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
          },

          title: {
            text: 'Income (thousand crores)',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: 'Income',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },

          title: {
            text: 'Operating Cashflow (thousand crores)',
            style: {
              color: '#00E396',
            },
          },
        },
        {
          seriesName: 'Revenue',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FEB019',
          },

          title: {
            text: 'Revenue (thousand crores)',
            style: {
              color: '#FEB019',
            },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };
  }

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = 'w' + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }

  detailed() {
    this.chartOptions1 = {
      series: [
        {
          name: 'Website Blog',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: 'Social Media',
          type: 'line',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: 'Traffic Sources',
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        '01 Jan 2001',
        '02 Jan 2001',
        '03 Jan 2001',
        '04 Jan 2001',
        '05 Jan 2001',
        '06 Jan 2001',
        '07 Jan 2001',
        '08 Jan 2001',
        '09 Jan 2001',
        '10 Jan 2001',
        '11 Jan 2001',
        '12 Jan 2001',
      ],
      xaxis: {
        type: 'datetime',
      },
      yaxis: [
        {
          title: {
            text: 'Website Blog',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Social Media',
          },
        },
      ],
    };
  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  getSubdivision() {
    this.subdivisionservice.getSubdivision().subscribe(
      (res: any) => {
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getSubstation(subdivision: string) {
    this.substation.getSubstationBySubdivision(subdivision).subscribe(
      (res: any) => {
        this.substatioDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.substatioDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getFeeder(substation: string) {
    this.feederservice.getFeederBySubstation(substation).subscribe(
      (res: any) => {
        this.feederDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.feederDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getDT(feeder: string) {
    this.dtservice.getDTByFeeder(feeder).subscribe(
      (res: any) => {
        console.log(res);
        this.dtDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  accessLevelChange() {
    if (this.formdata.accessLevel != 'CONSUMER') {
      this.getSubdivision();
    }
  }
  onSubmit(a:any){}
}
