import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData, MeterDatas } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-instant-data',
  templateUrl: './instant-data.component.html',
  styleUrls: ['./instant-data.component.css'],
})
export class InstantDataComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'Instant Data',
    url: '/mdm/meterdata/',
  };

  //#endregion

  formdata: MeterData = new MeterData();
  instant: MeterDatas = new MeterDatas();

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  importData: number[] = [];
  voltageData: number[] = [];
  currentData: number[] = [];
  powerData: number[] = [];
  labelData: string[] = [];

  consumerno: any[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  tableData: any[] = [];

  constructor(
    private service: DataService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };

    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'meterDateTime' },
      { field: 'mdasDateTime' },
      { field: 'energyExportKvah' },
      { field: 'energyImportKvah' },
      { field: 'energyExportKwh' },
      { field: 'energyImportKwh' },
      { field: 'voltage' },
      { field: 'phaseCurrent' },
      { field: 'neutralCurrent' },
      { field: 'activePowerKw' },
      { field: 'apparentPowerKva' },
      { field: 'pf' },
      { field: 'frequency' },
      { field: 'loadLimit' },
      { field: 'loadStatus' },
      { field: 'mdKva' },
      { field: 'mdKvaDateTime' },
      { field: 'mdKw' },
      { field: 'mdKwDateTime' },
      { field: 'powerOnDuration' },
      { field: 'programCount' },
      { field: 'tamperCount' },
    ];

    this.chartOptions = {
      series: [
        {
          name: 'Import (kwh)',
          type: 'column',
          data: [],
        },
        {
          name: 'Voltage',
          type: 'area',
          data: [],
        },
        {
          name: 'Current',
          type: 'line',
          data: [],
        },
        {
          name: 'Power (kwh)',
          type: 'line',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [],
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd/MM/yyyy',
        },
      },
      yaxis: {
        title: {
          text: 'Power (kwh)',
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {},
      },
    };
  }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 6);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.meterNo = '';
  }

  getInstant(from: any, to: any) {
    this.labelData = [];
    this.importData = [];
    this.voltageData = [];
    this.currentData = [];
    this.powerData = [];

    if (from == null && to == null) {
      from = new Date();
      to = new Date();
      from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
      to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');
    }

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.service
      .getInstantData(from, to, this.formdata.meterNo)
      .subscribe((res: any) => {
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.tableData.push({
              meterSNo: res.data[0][item][0],
              meterDateTime: res.data[0][item][1],
              mdasDateTime: res.data[0][item][2],
              energyExportKvah: res.data[0][item][3],
              energyImportKvah: res.data[0][item][4],
              energyExportKwh: res.data[0][item][5],
              energyImportKwh: res.data[0][item][6],
              voltage: res.data[0][item][7],
              phaseCurrent: res.data[0][item][8],
              neutralCurrent: res.data[0][item][9],
              activePowerKw: res.data[0][item][10],
              apparentPowerKva: res.data[0][item][11],
              pf: res.data[0][item][12],
              frequency: res.data[0][item][13],
              loadLimit: res.data[0][item][14],
              loadStatus: res.data[0][item][15],
              mdKva: res.data[0][item][16],
              mdKvaDateTime: res.data[0][item][17],
              mdKw: res.data[0][item][18],
              mdKwDateTime: res.data[0][item][19],
              powerOnDuration: res.data[0][item][20],
              programCount: res.data[0][item][21],
              tamperCount: res.data[0][item][22],
            });
            this.labelData.push(res.data[0][item][1].split(' ', 1)[0]);
            this.importData.push(parseFloat(res.data[0][item][6]));
            this.voltageData.push(parseFloat(res.data[0][item][7]));
            this.currentData.push(parseFloat(res.data[0][item][8]));
            this.powerData.push(parseFloat(res.data[0][item][10]));
          }
        }
        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();
        console.log(this.importData)
        console.log(this.voltageData)
        this.chartOptions.series = [
          {
            name: 'Import (kwh)',
            type: 'column',
            data: this.importData,
          },
          {
            name: 'Voltage',
            type: 'area',
            data: this.voltageData,
          },
          {
            name: 'Current',
            type: 'line',
            data: this.currentData,
          },
          {
            name: 'Power (kwh)',
            type: 'line',
            data: this.powerData,
          },
        ];

        this.chartOptions.labels = this.labelData;
      });
  }
  onSubmit(form: NgForm) {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );

    this.getInstant(this.formdata.fromdate, this.formdata.todate);
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
        (err) => {}
      );
    }
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'InstantData.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }
}
