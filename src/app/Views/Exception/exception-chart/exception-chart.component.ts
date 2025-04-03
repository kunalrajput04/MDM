import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccessLevel } from 'src/app/Model/access-level';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { ExceptionServiceService } from 'src/app/Service/exception-service.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-exception-chart',
  templateUrl: './exception-chart.component.html',
  styleUrls: ['./exception-chart.component.css'],
})
export class ExceptionChartComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Exception',
    levelurl: '',
    menuname: 'Event Chart',
    url: '/mdm/exception/',
  };

  //#endregion

  formData: AccessLevel = {
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
    accessLevel: 'Consumer',
  };

  accessLevel: string = localStorage.getItem('AccessLevel');
  accessValue: string = localStorage.getItem('AccessValue');
  formdata: MeterData = new MeterData();
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  lables: any = [];
  eventlables: any = [];
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;

  consumerno: any[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private exeservice: ExceptionServiceService,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Event Count',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
          export: {

            svg: {
              filename: 'event-count',
            },
            png: {
              filename: 'event-count',
            }
          },

        },
        zoom: {
          enabled: false,
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      fill: {
        colors: [
          function ({ value, seriesIndex, w }) {
            return (
              '#' +
              (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
            );
          },
        ],
      },
      yaxis: {
        labels: {
          // formatter: function (val, index) {
          //   return val.toFixed(2);
          // }
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: 'category',

        categories: this.lables,
      },
      dataLabels: {
        enabled: true,

        offsetX: 0,
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      // fill: {
      //   opacity: 1
      // }
    };
    this.chartOptions1 = {
      series: [
        {
          name: 'Event Count',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
          export: {

            svg: {
              filename: 'event-type-count',
            },
            png: {
              filename: 'event-type-count',
            }
          },
        },
        zoom: {
          enabled: false,
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      fill: {
        colors: [
          function ({ value, seriesIndex, w }) {
            return (
              '#' +
              (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
            );
          },
        ],
      },
      yaxis: {
        labels: {},
      },

      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        tickPlacement: 'on',
        categories: this.eventlables,
      },
      dataLabels: {
        enabled: true,

        offsetX: 0,
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
    };

    let date = new Date();
    date.setDate(date.getDate() - 3);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getEventData(from: any, to: any) {
    let accesslevel;
    let accessvalue;
    if (this.formData.accessLevel == '') {
      accesslevel = this.accessLevel;
      accessvalue = this.accessValue;
    } else if (
      this.formData.accessLevel == 'All' ||
      this.formData.accessLevel == 'ALL'
    ) {
      accessvalue = 'All';
    } else if (this.formData.accessLevel == 'SUBDEVISION') {
      accesslevel = 'SUBDEVISION';
      accessvalue = this.formData.subdivisonName;
    } else if (this.formData.accessLevel == 'SUBSTATION') {
      accesslevel = 'SUBSTATION';
      accessvalue = this.formData.substationName;
    } else if (this.formData.accessLevel == 'FEEDER') {
      accesslevel = 'FEEDER';
      accessvalue = this.formData.feederName;
    } else if (this.formData.accessLevel == 'DT') {
      accesslevel = 'DT';
      accessvalue = this.formData.dtName;
    }

    if (from == null && to == null) {
      from = new Date();
      to = new Date();
    } else {
      from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
      to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');
      let currentDate;
      let currenteventtype;
      let obj = [];
      let evntobj = [];
      this.exeservice
        .getEventData(from, to, this.formdata.meterNo, accesslevel, accessvalue)
        .subscribe((res: any) => {
          this.lables.length = 0;
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              //#region Date Code

              let data = this.datePipe.transform(
                res.data[0][item][2],
                'yyyy-MM-dd'
              );
              if (data !== currentDate) {
                currentDate = data;
                //#region  Cumlative Chart Logic
                this.lables.push(data);
                obj.push({
                  date: data,
                  count: 1,
                });
                //#endregion Cumlative Chart Logic end
              } else {
                let objIndex = obj.findIndex((obj) => obj.date == data);
                obj[objIndex].count = obj[objIndex].count + 1;
              }
              //#endregion Date Code End

              //#region Date Code

              let eventtype = res.data[0][item][5];
              let checkexists = evntobj.findIndex(
                (obj) => obj.date == eventtype
              );
              if (checkexists == -1) {
                currenteventtype = eventtype;
                //#region  Cumlative Chart Logic
                this.eventlables.push(eventtype);
                evntobj.push({
                  date: eventtype,
                  count: 1,
                });
                //#endregion Cumlative Chart Logic end
              } else {
                let objIndexx = evntobj.findIndex(
                  (obj) => obj.date == eventtype
                );
                evntobj[objIndexx].count = evntobj[objIndexx].count + 1;
              }
              //#endregion Date Code End
            }
          }

          this.chartOptions.series = [
            {
              name: 'Event Count',
              data: obj.map((a) => a.count),
            },
          ];
          this.chartOptions1.series = [
            {
              name: 'Event Type Count',
              data: evntobj.map((a) => a.count),
            },
          ];
        });
    }
  }

  rerender(from: any, to: any): void {
    this.getEventData(from, to);
  }

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
    this.rerender(this.formdata.fromdate, this.formdata.todate);
  }

  getSubdivision() {
    if (this.accessLevel == 'All' || this.accessLevel == 'ALL') {
      this.subdivisionservice.getSubdivision().subscribe((res: any) => {
        if (res != null) {
          this.subdivisionDropDown = [];
          let obj = res.data[0];
          for (var item in obj) {
            this.subdivisionDropDown.push(obj[item][0]);
          }
        }
      });
    } else if (this.accessLevel == 'SUBDEVISION') {
      this.substation
        .getSubstationBySubdivision(this.accessValue)
        .subscribe((res: any) => {
          this.substatioDropDown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.substatioDropDown.push(obj[item][0]);
            }
          }
        });
    } else if (this.accessLevel == 'SUBSTATION') {
      this.feederservice
        .getFeederBySubstation(this.accessValue)
        .subscribe((res: any) => {
          this.feederDropDown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.feederDropDown.push(obj[item][0]);
            }
          }
        });
    } else if (this.accessLevel == 'FEEDER') {
      this.dtservice.getDTByFeeder(this.accessValue).subscribe((res: any) => {
        this.dtDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.dtDropDown.push(obj[item][0]);
          }
        }
      });
    }
  }
  getSubstation(subdivision: string) {
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        this.substatioDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getFeeder(substation: string) {
    this.feederservice
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        this.feederDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getDT(feeder: string) {
    this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
      this.dtDropDown = [];
      if (res.data != null) {
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      }
    });
  }
  getConsumers(data: any) {
    let consumernumber = data.target.value;
    if (consumernumber.length > 3) {
      this.loading = true;
      this.storeservice.getConsumerWithMeterNo(consumernumber).subscribe(
        (res: any) => {
          this.consumerno = res.data;
          this.loading = false;
        },
        (err) => { }
      );
    }
  }
}
