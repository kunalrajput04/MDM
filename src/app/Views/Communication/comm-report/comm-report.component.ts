import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import {
  FitBoundsOptions,
  icon,
  latLng,
  LatLngBounds,
  MapOptions,
  marker,
  markerClusterGroup,
  MarkerClusterGroup,
  MarkerClusterGroupOptions,
  tileLayer,
} from 'leaflet';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

export interface IMeterInfo {
  consumerName: string;
  meterSerialNo: string;
  ipAddress: string;
  consumerNo: string;
  meterType: string;
  UpdatedDate: string;
  latitude: string;
  longitude: string;
  simType: string;
  status: string;
  isSuccess: boolean;
}
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
  selector: 'app-comm-report',
  templateUrl: './comm-report.component.html',
  styleUrls: ['./comm-report.component.css'],
})
export class CommReportComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'Level Communication',
    url: 'mdm/communication',
  };

  //#endregion
  formdata: IFilterData = {
    accessLevel: 'SUBDIVISION',
    dataRange: 'DAILY',
    fromdate: '',
    meterNo: '',
    todate: '',
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
  };
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public meterchartOptions: Partial<ChartOptions>;
  commRead: any[] = [0, 0, 0, 0];
  instantRead: any[] = [0, 0, 0, 0];
  dlpRead: any[] = [0, 0, 0, 0];
  lpRead: any[] = [0, 0, 0, 0];
  billingRead: any[] = [0, 0, 0, 0];
  metertypeRead: any[] = [0, 0, 0, 0];
  eventRead: any[] = [0, 0, 0, 0];
  meterInfo: IMeterInfo[] = [];
  commchart: any;
  instatnchart: any;
  dlpchart: any;
  lpchart: any;
  eventchart: any;
  billingchart: any;
  metertypechart: any;
  chartData: any[] = [];

  graphHeaderValue: string = '';
  weekdropvalue: string = '';
  weekdate: string = '';
  isclick: boolean = false;

  levelName: string = localStorage.getItem('AccessLevel');
  levelValue: string = localStorage.getItem('AccessValue');
  resultData: any;
  isChartRendered: boolean = false;

  markerClusterGroup: MarkerClusterGroup;
  markerClusterData = [];
  mapFitToBounds: LatLngBounds;
  mapFitToBoundsOptions: FitBoundsOptions;

  mapOptions: MapOptions;
  map: any;
  simType: string = 'All';
  commandType: string = 'LastComm';
  dropDownValue: string = 'Today';
  markerClusterOptions: MarkerClusterGroupOptions = {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
  };

  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  inactiveCount: number = 0;

  activeCount: number = 0;
  faultyCount: number = 0;
  constructor(
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private chartservice: DataService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private toastr: ToastrService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    let thispage = this;

    this.commchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          thispage.commandType = 'LastComm';
          thispage.setCommReportChartData();
        },
      },
    };

    this.metertypechart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          if (dataPointIndex == 0) {
            thispage.simType = 'AIRTEL';
            thispage.setCommReportChartData();
          } else {
            thispage.simType = 'JIO';
            thispage.setCommReportChartData();
          }
        },
      },
    };

    this.instatnchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          thispage.commandType = 'Instant';
          thispage.setCommReportChartData();
        },
      },
    };

    this.dlpchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          thispage.commandType = 'DailyLp';
          thispage.setCommReportChartData();
        },
      },
    };

    this.lpchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          thispage.commandType = 'DeltaLp';
          thispage.setCommReportChartData();
        },
      },
    };

    this.eventchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          thispage.commandType = 'Events';
          thispage.setCommReportChartData();
        },
      },
    };

    this.billingchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          thispage.commandType = 'Billing';
          thispage.setCommReportChartData();
        },
      },
    };
    this.chartOptions = {
      series: [],

      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64'],
      },
      labels: ['Success', 'Failure', 'Inactive'],
      colors: ['#00D100', '#B32824', '#6e6d64'],

      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
    this.meterchartOptions = {
      series: [],

      fill: {
        colors: ['#eb9234', '#6b34eb'],
      },
      labels: ['Airtel', 'JIO'],
      colors: ['#eb9234', '#6b34eb'],

      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };

    this.gridOptions = {
      context: { componentParent: this },
      getRowStyle: (params) => {
        if (params.data.isSuccess === false) {
          return { background: '#e99292' };
        } else {
          return { background: '#7fcb7f' };
        }
      },
    };

    this.defaultColDef = { resizable: true, filter: true, sortable: true };

    this.columnDefs = [
      { field: 'consumerName' },

      { field: 'meterSerialNo' },
      { field: 'consumerNo' },
      { field: 'meterType' },
      { field: 'simType' },
      { field: 'status' },
      { field: 'ipAddress' },
      { field: 'UpdatedDate' },
      { field: 'latitude' },
      { field: 'longitude' },
      { field: 'isSuccess' },
    ];
  }

  ngOnInit(): void {
    this.getSubdivision();
    let filter = new Date();
    let date;
    date = this.datePipe.transform(
      filter.setDate(filter.getDate()),
      'yyyy-MM-dd'
    );
    this.weekdate = date;
    this.markerClusterGroup = markerClusterGroup({
      removeOutsideVisibleBounds: true,
    });
    this.mapFitToBoundsOptions = { maxZoom: 12, animate: true };
    this.initializeMapOptions();
    // this.getDashboardChartComman();
  }
  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(28.7041, 77.1025),
      zoom: 9,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }
  onMapReady(data: any) {
    this.map = data;
  }
  dropDownChange() {
    let filter = new Date();
    let date;
    if (this.dropDownValue == 'Today')
      date = this.datePipe.transform(filter, 'yyyy-MM-dd');
    else if (this.dropDownValue == 'Yesterday')
      date = this.datePipe.transform(
        filter.setDate(filter.getDate() - 1),
        'yyyy-MM-dd'
      );
    else if (this.dropDownValue == 'Last Week')
      date = this.datePipe.transform(
        filter.setDate(filter.getDate() - 7),
        'yyyy-MM-dd'
      );
    else if (this.dropDownValue == 'Last Month')
      date = this.datePipe.transform(
        filter.setDate(filter.getDate() - 31),
        'yyyy-MM-dd'
      );

    this.weekdropvalue = this.dropDownValue;
    this.weekdate = date;

    this.setCommReportChartData();
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'SLAReport.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getDashboardChartComman() {
    this.setLevelValueName();
    this.isChartRendered = true;

    this.chartservice
      .getCommReportChartData(this.levelName, this.levelValue)
      .subscribe((res: any) => {
        if (res != null) {
          if (res.data != null) {
            this.resultData = res.data[0];

            this.setCommReportChartData();
          }
        }
      });
  }
  setLevelValueName() {
    if (this.formdata.accessLevel == 'SUBDIVISION') {
      this.levelValue = this.formdata.subdivisonName;
      this.levelName = 'SUBDEVISION';
    } else if (this.formdata.accessLevel == 'SUBSTATION') {
      this.levelValue = this.formdata.substationName;
      this.levelName = 'SUBSTATION';
    } else if (this.formdata.accessLevel == 'FEEDER') {
      this.levelValue = this.formdata.feederName;
      this.levelName = 'FEEDER';
    } else if (this.formdata.accessLevel == 'DT') {
      this.levelValue = this.formdata.dtName;
      this.levelName = 'DT';
    }
  }

  reSetSimType() {
    this.simType = 'All';
    this.setCommReportChartData();
  }
  setCommReportChartData() {
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.inactiveCount = 0;
    this.activeCount = 0;
    this.faultyCount = 0;
    this.meterInfo = [];
    this.spinner.show();
    this.markerClusterGroup.clearLayers();
    let airtelcount = 0;
    let jiocount = 0;
    let startDate = new Date();
    let endDate = new Date();

    let commSuccessCount = 0;
    let commFailureCount = 0;
    let instantSuccessCount = 0;
    let instantFailureCount = 0;
    let billingSuccessCount = 0;
    let billingFailureCount = 0;
    let dailySuccessCount = 0;
    let dailyFailureCount = 0;
    let deltaSuccessCount = 0;
    let deltaFailureCount = 0;
    let eventSuccessCount = 0;
    let eventFailureCount = 0;

    if (this.weekdropvalue == 'Last Week')
      startDate.setDate(endDate.getDate() - 7);
    else if (this.weekdropvalue == 'Yesterday')
      startDate.setDate(endDate.getDate() - 1);
    else if (this.weekdropvalue == 'Last Month')
      startDate.setDate(endDate.getDate() - 30);
    else startDate.setDate(endDate.getDate());

    for (let item in this.resultData) {
      let lastUpdateDate;
      let isSuccess = false;
      let status = '';
      let simType;

      if (parseInt(item) !== 1) {
        if (this.resultData[item][2] == 'Down') {
          this.inactiveCount++;
          status = 'Inactive';
        } else if (this.resultData[item][2] == 'Active') {
          this.activeCount++;
          status = 'Active';
        } else if (this.resultData[item][2] == 'Faulty') {
          this.faultyCount++;
          status = 'Faulty';
        } else if (
          this.resultData[item][2] == 'null' ||
          this.resultData[item][2] == null ||
          this.resultData[item][2] == ''
        ) {
          this.inactiveCount++;
          status = 'Inactive';
        }

        let title =
          '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
          '<b>CONSUMER NUMBER :</b>' +
          this.resultData[item][3] +
          '<br><b>CONSUMER NAME :</b>' +
          this.resultData[item][0] +
          '<br><b>METER S.NO :</b> ' +
          this.resultData[item][1] +
          '<br><b>LOAD STATUS :</b>' +
          this.resultData[item][4] +
          '<br><b>LATITUDE :</b> ' +
          this.resultData[item][12] +
          '<br><b>LONGITUDE :</b> ' +
          this.resultData[item][12] +
          '</div>';
        let iconurl = '/assets/images/airtelsuccess.png';

        //comm count

        if (this.resultData[item][6] == '-') {
          if (this.commandType == 'LastComm') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            commFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][6]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'LastComm') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            commSuccessCount++;
          } else {
            if (this.commandType == 'LastComm') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                airtelcount++;
                iconurl = '/assets/images/airtelfail.png';
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                jiocount++;
                iconurl = '/assets/images/jiofail.png';
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              commFailureCount++;
          }
        }

        //comm count

        //instant count

        if (this.resultData[item][7] == '-') {
          if (this.commandType == 'Instant') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            instantFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][7]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'Instant') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            instantSuccessCount++;
          } else {
            if (this.commandType == 'Instant') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                jiocount++;
                iconurl = '/assets/images/jiofail.png';
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              instantFailureCount++;
          }
        }

        //instant count

        //billing count

        if (this.resultData[item][8] == '-') {
          if (this.commandType == 'Billing') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][4].substring(0, 4) == '2401'
            ) {
              airtelcount++;
              iconurl = '/assets/images/airtelfail.png';
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][4].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            billingFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][8]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'Billing') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                jiocount++;
                iconurl = '/assets/images/jiosuccess.png';
                simType = 'JIO';
              }
            }
            billingSuccessCount++;
          } else {
            if (this.commandType == 'Billing') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              billingFailureCount++;
          }
        }
        //billing count

        //daily lp count

        if (this.resultData[item][9] == '-') {
          if (this.commandType == 'DailyLp') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            dailyFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][9]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'DailyLp') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            dailySuccessCount++;
          } else {
            if (this.commandType == 'DailyLp') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              dailyFailureCount++;
          }
        }
        //daily lp count

        //delta lp count

        if (this.resultData[item][9] == '-') {
          if (this.commandType == 'DeltaLp') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              simType = 'Airtel';
              airtelcount++;
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            deltaFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][10]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'DeltaLp') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            deltaSuccessCount++;
          } else {
            if (this.commandType == 'DeltaLp') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              deltaFailureCount++;
          }
        }
        //delta lp count

        //event  count

        if (this.resultData[item][11] == '-') {
          if (this.commandType == 'Events') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            eventFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][11]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'Events') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            eventSuccessCount++;
          } else {
            if (this.commandType == 'Events') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              eventFailureCount++;
          }
        }
        //event count

        if (this.commandType == 'LastComm')
          lastUpdateDate = this.resultData[item][6];
        else if (this.commandType == 'Instant')
          lastUpdateDate = this.resultData[item][7];
        else if (this.commandType == 'Billing')
          lastUpdateDate = this.resultData[item][8];
        else if (this.commandType == 'DailyLp')
          lastUpdateDate = this.resultData[item][9];
        else if (this.commandType == 'DeltaLp')
          lastUpdateDate = this.resultData[item][10];
        else if (this.commandType == 'Events')
          lastUpdateDate = this.resultData[item][11];

        if (
          this.resultData[item][5] != null &&
          this.simType == 'AIRTEL' &&
          this.resultData[item][5].substring(0, 4) == '2401'
        ) {
          if (
            this.resultData[item][12] != '-' &&
            this.resultData[item][12] != '--' &&
            this.resultData[item][12] != 'null' &&
            this.resultData[item][12] != 'NaN' &&
            this.resultData[item][13] != '-' &&
            this.resultData[item][13] != '--' &&
            this.resultData[item][13] != 'null' &&
            this.resultData[item][13] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][12]),
                parseFloat(this.resultData[item][13]),
              ],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: iconurl,
                }),
              }
            ).bindPopup(title);
            this.markerClusterGroup.addLayer(newMarker);
            this.markerClusterGroup.addTo(this.map);
          }
          this.meterInfo.push({
            consumerName: this.resultData[item][0],
            UpdatedDate: lastUpdateDate,
            consumerNo: this.resultData[item][2],
            ipAddress: this.resultData[item][4],
            latitude: this.resultData[item][12],
            longitude: this.resultData[item][13],
            meterSerialNo: this.resultData[item][1],
            meterType: this.resultData[item][3],
            isSuccess: isSuccess,
            simType: simType,
            status: status,
          });
        } else if (
          this.resultData[item][5] != null &&
          this.simType == 'JIO' &&
          this.resultData[item][5].substring(0, 4) == '2405'
        ) {
          if (
            this.resultData[item][12] != '-' &&
            this.resultData[item][12] != '--' &&
            this.resultData[item][12] != 'null' &&
            this.resultData[item][12] != 'NaN' &&
            this.resultData[item][13] != '-' &&
            this.resultData[item][13] != '--' &&
            this.resultData[item][13] != 'null' &&
            this.resultData[item][13] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][12]),
                parseFloat(this.resultData[item][13]),
              ],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: iconurl,
                }),
              }
            ).bindPopup(title);
            this.markerClusterGroup.addLayer(newMarker);
            this.markerClusterGroup.addTo(this.map);
          }
          this.meterInfo.push({
            consumerName: this.resultData[item][0],
            UpdatedDate: lastUpdateDate,
            consumerNo: this.resultData[item][3],
            ipAddress: this.resultData[item][5],
            latitude: this.resultData[item][12],
            longitude: this.resultData[item][13],
            meterSerialNo: this.resultData[item][1],
            meterType: this.resultData[item][4],
            isSuccess: isSuccess,
            simType: simType,
            status: status,
          });
        } else if (this.simType == 'All') {
          if (
            this.resultData[item][12] != '-' &&
            this.resultData[item][12] != '--' &&
            this.resultData[item][12] != 'null' &&
            this.resultData[item][12] != 'NaN' &&
            this.resultData[item][13] != '-' &&
            this.resultData[item][13] != '--' &&
            this.resultData[item][13] != 'null' &&
            this.resultData[item][13] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][12]),
                parseFloat(this.resultData[item][13]),
              ],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: iconurl,
                }),
              }
            ).bindPopup(title);
            this.markerClusterGroup.addLayer(newMarker);
            this.markerClusterGroup.addTo(this.map);
          }
          this.meterInfo.push({
            consumerName: this.resultData[item][0],
            UpdatedDate: lastUpdateDate,
            consumerNo: this.resultData[item][3],
            ipAddress: this.resultData[item][5],
            latitude: this.resultData[item][12],
            longitude: this.resultData[item][13],
            meterSerialNo: this.resultData[item][1],
            meterType: this.resultData[item][4],
            isSuccess: isSuccess,
            simType: simType,
            status: status,
          });
        }
      }
    }

    this.markerClusterGroup.addTo(this.map);
    this.spinner.hide();

    //this.rerender();
    this.commRead = [
      commSuccessCount,
      commFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.instantRead = [
      instantSuccessCount,
      instantFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.dlpRead = [
      dailySuccessCount,
      dailyFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.lpRead = [
      deltaSuccessCount,
      deltaFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.eventRead = [
      eventSuccessCount,
      eventFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.billingRead = [
      billingSuccessCount,
      billingFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.metertypeRead = [airtelcount, jiocount];

    this.gridApi.setRowData(this.meterInfo);
    this.gridColumnApi.autoSizeAllColumns();

    if (this.commandType == 'LastComm') {
      this.graphHeaderValue = 'Communication Status';
    } else if (this.commandType == 'Instant') {
      this.graphHeaderValue = 'Instant Data';
    } else if (this.commandType == 'DailyLp') {
      this.graphHeaderValue = 'Daily Load Profile Data ';
    } else if (this.commandType == 'DeltaLp') {
      this.graphHeaderValue = 'Load Profile Data';
    } else if (this.commandType == 'Events') {
      this.graphHeaderValue = 'Event Data';
    } else if (this.commandType == 'Billing') {
      this.graphHeaderValue = 'Billing Data';
    }
  }

  // callFunctionForChart() {
  //   this.getDashboardChartComman();
  // }

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
}
