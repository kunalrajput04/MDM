import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccessLevel } from 'src/app/Model/access-level';
import { HeaderMenu } from 'src/app/Model/header-menu';
import {
  IFeederData,
  IRevenueResponse,
  ISubstationData,
} from 'src/app/Model/irevenue-response';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-revenue-graph',
  templateUrl: './revenue-graph.component.html',
  styleUrls: ['./revenue-graph.component.css'],
})
export class RevenueGraphComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Revenue Graph',
    url: '/mdm/revenue/',
  };

  //#endregion
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  treeData: IRevenueResponse[] = [];
  subtationtreeData: ISubstationData[] = [];
  feedertreeData: IFeederData[] = [];
  dttreeData: string[] = [];
  accessLevel: string = localStorage.getItem('AccessLevel');
  formdata: MeterData = new MeterData();
  formData: AccessLevel = {
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
    accessLevel: '',
  };
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];

  accessValue: string = localStorage.getItem('AccessValue');

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private authservice: AuthService,
    private data: DataService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.chartOptions = {
      series: [
        {
          name: 'Due Amount',
          type: 'column',
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
        },
        {
          name: 'Collected Amount',
          type: 'column',
          data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
        },
        {
          name: 'Total Revenue',
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
        text: 'Revenue Data',
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
          labels: {
            style: {
              colors: '#008FFB',
            },
          },
          title: {
            text: 'Due Amount (thousand crores)',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: 'Due Amount',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          labels: {
            style: {
              colors: '#00E396',
            },
          },
          title: {
            text: 'Collected Amount (thousand crores)',
            style: {
              color: '#00E396',
            },
          },
        },
        {
          seriesName: 'Collected Amount',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FEB019',
          },
          labels: {
            style: {
              colors: '#FEB019',
            },
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

  ngOnInit(): void {}

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
  }
  getSubstation(subdivision: string) {
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        this.substatioDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.substatioDropDown.push(obj[item][0]);
        }
      });
  }
  getFeeder(substation: string) {
    this.feederservice
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        this.feederDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.feederDropDown.push(obj[item][0]);
        }
      });
  }
  getDT(feeder: string) {
    this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
      this.dtDropDown = [];

      let obj = res.data[0];
      for (var item in obj) {
        this.dtDropDown.push(obj[item][0]);
      }
    });
  }

  getSubdivision() {
    if (this.accessLevel == 'All' || this.accessLevel == 'ALL') {
      this.subdivisionservice.getSubdivision().subscribe((res: any) => {
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      });
    } else if (this.accessLevel == 'SUBDEVISION') {
      this.substation
        .getSubstationBySubdivision(this.accessValue)
        .subscribe((res: any) => {
          this.substatioDropDown = [];

          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
        });
    } else if (this.accessLevel == 'SUBSTATION') {
      this.feederservice
        .getFeederBySubstation(this.accessValue)
        .subscribe((res: any) => {
          this.feederDropDown = [];

          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        });
    } else if (this.accessLevel == 'FEEDER') {
      this.dtservice.getDTByFeeder(this.accessValue).subscribe((res: any) => {
        this.dtDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      });
    }
  }
}
