import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css'],
})
export class LoadDataComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'Load Profile Data',
    url: '/mdm/meterdata/',
  };

  //#endregion

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  formdata: MeterData = new MeterData();

  voltageData: number[] = [];
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
    this.chartOptions = {
      series: [
        {
          name: 'Current Voltage',
          data: [],
        },
        {
          name: 'Energy',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Voltage',
        },
        min: 0,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };

    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'mdasDateTime' },
      { field: 'intervalDateTime' },
      { field: 'avgCurrent' },
      { field: 'avgVoltage' },
      { field: 'blockEnergyExportKvah' },
      { field: 'blockEnergyImportKvah' },
      { field: 'blockEnergyExportKwh' },
      { field: 'blockEnergyImportKwh' },
    ];
  }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
      fileName: 'LOadData.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
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

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.labelData = [];
    this.voltageData = [];
    this.powerData = [];
    this.service
      .getLoadProfileData(
        this.formdata.fromdate,
        this.formdata.todate,
        this.formdata.meterNo
      )
      .subscribe((res: any) => {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                meterSNo: res.data[0][item][0],
                mdasDateTime: res.data[0][item][1],
                intervalDateTime: res.data[0][item][2],
                avgCurrent: res.data[0][item][3],
                avgVoltage: res.data[0][item][4],
                blockEnergyExportKvah: res.data[0][item][5],
                blockEnergyImportKvah: res.data[0][item][6],
                blockEnergyExportKwh: res.data[0][item][7],
                blockEnergyImportKwh: res.data[0][item][8],
              });
              this.labelData.push(res.data[0][item][2]);
              this.voltageData.push(parseFloat(res.data[0][item][4]));
              this.powerData.push(parseFloat(res.data[0][item][8]));
            }
          }

          this.chartOptions.series = [
            {
              name: 'Current Voltage',
              data: this.voltageData,
            },
            {
              name: 'Energy',
              data: this.powerData,
            },
          ];

          this.chartOptions.xaxis = {
            type: 'datetime',
            categories: this.labelData,
          };

          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        } else this.gridApi.setRowData([]);
      });
  }
}
