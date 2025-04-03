import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Column } from 'ag-grid-community';
import { DataTableDirective } from 'angular-datatables';
import { ApexNonAxisChartSeries, ChartComponent } from 'ng-apexcharts';
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
  selector: 'app-billing-data',
  templateUrl: './billing-data.component.html',
  styleUrls: ['./billing-data.component.css'],
})
export class BillingDataComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'Billing Data',
    url: '/mdm/meterdata/',
  };

  //#endregion

  formdata: MeterData = new MeterData();

  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>; //Pie1-chart
  public chartOptions2: Partial<ChartOptions>; //PF-chart
  public chartOptions3: Partial<ChartOptions>; //MD-chart
  public chartOptions4: Partial<ChartOptions>; //pie2-chart
  chartData: ApexNonAxisChartSeries;
  // *****************
  importDataT1: any[] = [];
  importDataT2: any[] = [];
  importDataT3: any[] = [];
  importDataT4: any[] = [];
  importkvahdata: number[] = [];
  exportdata: number[] = [];
  exportkvahdata: number[] = [];
  labelData: string[] = [];
  labelData1: string[] = [];
  labelData2: string[] = [];
  // ***************
  mainImportData: any[] = [];
  mainImportKvahData: any[] = [];
  mainExportData: any[] = [];
  mainExportKvahData: any[] = [];
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
    // Bar-Chart*************************
    this.chartOptions = {
      series: [
        {
          name: 'Export (KVAH)',
          data: [],
        },
        {
          name: 'Import (KVAH)',
          data: [],
        },
        {
          name: 'Export (KWH)',
          data: [],
        },
        {
          name: 'Import (KWH)',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        // stacked: true,
        events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min));
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
        },
      },
      colors: ['#008FFB', '#00E396', '#CED4DC', '#4287f5'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },

      xaxis: {
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        categories: [],
      },
      yaxis: [
        {
          axisTicks: {
            // show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              // colors: '#008FFB',
            },
          },
          title: {
            // text: 'Billing Amount (thousand crores)',
            style: {
              color: '#008FFB',
            },
          },
          // tooltip: {
          //   enabled: true,
          // },
        },

        // {
        //   seriesName: 'Due Amount',
        //   opposite: true,
        //   axisTicks: {
        //     show: true,
        //   },
        //   axisBorder: {
        //     show: true,
        //     color: '#00E396',
        //   },
        //   labels: {
        //     style: {
        //       colors: '#00E396',
        //     },
        //   },
        //   title: {
        //     text: 'Collected Amount (thousand crores)',
        //     style: {
        //       color: '#00E396',
        //     },
        //   },
        // },
        // {
        //   seriesName: 'Collected Amount',
        //   opposite: true,
        //   axisTicks: {
        //     show: true,
        //   },
        //   axisBorder: {
        //     show: true,
        //     color: '#FEB019',
        //   },
        //   labels: {
        //     style: {
        //       colors: '#FEB019',
        //     },
        //   },
        //   title: {
        //     text: 'Revenue (thousand crores)',
        //     style: {
        //       color: '#FEB019',
        //     },
        //   },
        // },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      // legend: {
      //   horizontalAlign: 'left',
      //   offsetX: 40,
      // },
    };
    // Pie-Chart *************************************************
    this.chartOptions1 = {
      pieseries: [
        // 301.51,
        // 1096.98,
        // 1458.59,
        // 677.73,
      ],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: [
        // "Energy(Kvah) T1",
        // "Energy(Kvah) T2",
        // "Energy(Kvah) T3",
        // "Energy(Kvah) T4",
      ],

      dataLabels: {
        enabled: true,
        formatter: function (val, index) {
          return val.toString();
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    // Pie-chart2***********************************************************
    this.chartOptions4 = {
      pieseries: [
        // 301.51,
        // 1096.98,
        // 1458.59,
        // 677.73,
      ],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: [
        // "Energy(Kvah) T1",
        // "Energy(Kvah) T2",
        // "Energy(Kvah) T3",
        // "Energy(Kvah) T4",
      ],

      dataLabels: {
        enabled: true,
        formatter: function (val, index) {
          return val.toString();
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    // PF-Chart*******************************************
    this.chartOptions2 = {
      series: [
        {
          name: 'Export (KVAH)',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min));
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
        },
      },
      colors: ['#008FFB', '#00E396', '#CED4DC', '#4287f5'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },

      xaxis: {
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        categories: [],
        title: {
          text: 'Month',
          style: {
            color: '#008FFB',
          },
        },
      },
      yaxis: [
        {
          axisTicks: {},
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              // colors: '#008FFB',
            },
          },
          title: {
            text: 'PF Amount',
            style: {
              color: '#008FFB',
            },
          },
          // tooltip: {
          //   enabled: true,
          // },
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
      // legend: {
      //   horizontalAlign: 'left',
      //   offsetX: 40,
      // },
    };

    // MD-Chart*******************************************
    this.chartOptions3 = {
      series: [
        {
          name: 'Export (KWH)',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min));
          }
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },

      stroke: {
        width: 2,
        show: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
        },
      },
      colors: ["#008FFB", "#00E396", "#CED4DC","#4287f5"],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        categories: [],
        title: {
          text: 'Month',
          style: {
            color: '#008FFB',
          },
        },
      },
      yaxis: [
        {
          axisTicks: {},
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              // colors: '#008FFB',
            },
          },
          title: {
            text: 'MD Amount',
            style: {
              color: '#008FFB',
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
    };
    // *********************************************
    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'mdasDateTime' },
      { field: 'billingDateTime' },
      { field: 'avgPF' },
      { field: 'powerOnDuration' },
      { field: 'powerOffDuration' },
      { field: 'energyExportKvah' },
      { field: 'energyImportKvah' },
      { field: 'energyKvahT1' },
      { field: 'energyKvahT2' },
      { field: 'energyKvahT3' },
      { field: 'energyKvahT4' },
      { field: 'energyKvahT5' },
      { field: 'energyKvahT6' },
      { field: 'energyKvahT7' },
      { field: 'energyKvahT8' },
      { field: 'energyExportKwh' },
      { field: 'energyImportKwh' },
      { field: 'energyKwhT1' },
      { field: 'energyKwhT2' },
      { field: 'energyKwhT3' },
      { field: 'energyKwhT4' },
      { field: 'energyKwhT5' },
      { field: 'energyKwhT6' },
      { field: 'energyKwhT7' },
      { field: 'energyKwhT8' },
      { field: 'mdKva' },
      { field: 'mdKvaDateTime' },
      { field: 'mdKw' },
      { field: 'mdKwDateTime' },
    ];
  }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 180);
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
          console.log(res.data);
          this.loading = false;
        },
        (err) => {}
      );
    }
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'BillingData.csv',
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
    this.mainImportKvahData = [];
    this.mainExportData = [];
    this.mainExportKvahData = [];
    this.service
      .getBillingData(
        this.formdata.fromdate,
        this.formdata.todate,
        this.formdata.meterNo
      )
      .subscribe((res: any) => {
        if (res.data != null) {
          if (res.data[0][1]) {
            //Pie-chart-KVAH*******************
            this.labelData = [
              res.data[0][1][8],
              res.data[0][1][9],
              res.data[0][1][10],
              res.data[0][1][11],
            ];
            this.importDataT1 = [
              parseFloat(res.data[0][2][8]),
              parseFloat(res.data[0][2][9]),
              parseFloat(res.data[0][2][10]),
              parseFloat(res.data[0][2][11]),
            ];
            console.log(this.importDataT1, res.data[0][2]);
          }
          // Pie-chart-KWH*******************
          this.labelData1 = [
            res.data[0][1][18],
            res.data[0][1][19],
            res.data[0][1][20],
            res.data[0][1][21],
          ];
          this.importDataT2 = [
            parseFloat(res.data[0][2][18]),
            parseFloat(res.data[0][2][19]),
            parseFloat(res.data[0][2][20]),
            parseFloat(res.data[0][2][21]),
          ];
          console.log(this.importDataT1, res.data[0][2]);

        
          let label = [];
          for (const item in res.data[0]) {
          if (parseInt(item) !== 1) {

            // PF-Bar-chart************************************
            var date2 = new Date(res.data[0][item][2]);
            function formatDate(date) {
                            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            var year = date.getFullYear();
                            var month = months[date.getMonth()];
                            return  month + "-" + year;
                        }
                        console.log(formatDate(date2));
            console.log(new Date(res.data[0][item][2]));
           
          label.push(formatDate(date2));
          label = Array.from(new Set(label));
          this.importDataT3.push(parseFloat(res.data[0][item][3]));

          // MD-Bar-chart***************************

            label.push(formatDate(date2));
          this.importDataT4.push(parseFloat(res.data[0][item][28]));
           

            // Billing-Determinant***************************************
            label.push(formatDate(date2));
            this.mainExportData.push(parseFloat(res.data[0][item][16]));
            this.mainImportData.push(parseFloat(res.data[0][item][17]));
            
              this.mainImportKvahData.push(parseFloat(res.data[0][item][7]));
               this.mainExportKvahData.push(parseFloat(res.data[0][item][6]));

            // ***************************************************************
          }
            this.tableData.push({
              meterSNo: res.data[0][item][0],

              mdasDateTime: res.data[0][item][1],
              billingDateTime: res.data[0][item][2],
              avgPF: res.data[0][item][3],
              powerOnDuration: res.data[0][item][4],
              powerOffDuration: res.data[0][item][5],
              energyExportKvah: res.data[0][item][6],
              energyImportKvah: res.data[0][item][7],
              energyKvahT1: res.data[0][item][8],
              energyKvahT2: res.data[0][item][9],
              energyKvahT3: res.data[0][item][10],
              energyKvahT4: res.data[0][item][11],
              energyKvahT5: res.data[0][item][12],
              energyKvahT6: res.data[0][item][13],
              energyKvahT7: res.data[0][item][14],
              energyKvahT8: res.data[0][item][15],
              energyExportKwh: res.data[0][item][16],
              energyImportKwh: res.data[0][item][17],
              energyKwhT1: res.data[0][item][18],
              energyKwhT2: res.data[0][item][19],
              energyKwhT3: res.data[0][item][20],
              energyKwhT4: res.data[0][item][21],
              energyKwhT5: res.data[0][item][22],
              energyKwhT6: res.data[0][item][23],
              energyKwhT7: res.data[0][item][24],
              energyKwhT8: res.data[0][item][25],
              mdKva: res.data[0][item][26],
              mdKvaDateTime: res.data[0][item][27],
              mdKw: res.data[0][item][28],
              mdKwDateTime: res.data[0][item][29],
            });
          }
        
          this.chartOptions2.labels = label;
          this.chartOptions3.labels = label;
          this.chartOptions.labels = label
          // this.chartOptions.labels= this.labelData1
          this.chartOptions.series = [
            {
              name: 'Import (kwh)',
              type: 'column',
              data: this.mainImportData,
            },
            {
              name: 'Export (kwh)',
              type: 'column',
              data: this.mainExportData,
            },
            {
              name: 'Import (kvah)',
              type: 'column',
              data: this.mainImportKvahData,
            },
            {
              name: 'Export (kvah)',
              type: 'column',
              data: this.mainExportKvahData,
            },
          ];
          
          //Chartoption2-PF-Bar-Chart************
          this.chartOptions2.series = [
            {
              name: 'Import (kwh)',
              type: 'column',
              data: this.importDataT3,
            },
            
          ];
          //Chartoption3-MD-Bar-Chart************
          this.chartOptions3.series = [
            {
              name: 'mdKw',
              type: 'column',
              data: this.importDataT4,
            },
          ];
          // Pie-chart1-Data***************
          this.chartOptions1 = {
            pieseries: this.importDataT1,
            chart: {
              type: 'pie',
            },
            labels: this.labelData,
          };
          // Pie-chart1-Data***************

          this.chartOptions4 = {
            pieseries: this.importDataT2,
            chart: {
              type: 'pie',
            },
            labels: this.labelData1,
          };
          // ***********************************
          this.gridApi.setRowData(this.tableData);
          console.log(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        } else this.gridApi.setRowData([]);
      
  });
  }
}
