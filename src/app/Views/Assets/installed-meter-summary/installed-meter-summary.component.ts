import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterSummaryResponse } from 'src/app/Model/meter-summary-response';
import { AssetsService } from 'src/app/Service/assets.service';
import { AuthService } from 'src/app/Service/auth.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-installed-meter-summary',
  templateUrl: './installed-meter-summary.component.html',
  styleUrls: ['./installed-meter-summary.component.css'],
})
export class InstalledMeterSummaryComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Assets/Installed Summary',
    url: '/mdm/assets/summary',
  };

  //#endregion
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  dataList: any[] = [];
  fromDate: string = '';
  toDate: string = '';

  @ViewChild('chart') chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  response: MeterSummaryResponse;

  constructor(
    private service: AssetsService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      { field: 'monthName' },
      { field: 'singlePhase' },
      { field: 'threePhase' },
      { field: 'ctMeter', headerName: 'CT Meter' },
      { field: 'htMeter', headerName: 'HT Meter' },
      { field: 'jio' },
      { field: 'airtel' },
      { field: 'totalMeterCount' },

    ];
    // Bar-Chart*************************
    this.chartOptions = {
      series: [

      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"

        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [

        ]
      },
      yaxis: {
        title: {
          text: "Meter Count"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }

  ngOnInit(): void { }

  onBtnExport() {
    var excelParams = {
      fileName: 'InstalledMetersSummary_' + this.fromDate + ' .csv',
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
  onList() {
    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.service.getInstalledDevicesSummary(this.fromDate, this.toDate).subscribe(
      (res: any) => {
        if (res.success) {
          debugger
          let chartData = [];
          this.response = res.data;
          this.dataList = this.response.meterSummaries;
          this.response.chartData.forEach(function (item) {
            chartData.push({
              name: item.name,
              data: item.count
            });
          });

          this.gridApi.setRowData(this.dataList);
          this.gridColumnApi.autoSizeAllColumns();
          this.reInitializeChart(chartData, this.response.monthNames)
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      }
    );
  }
  reInitializeChart(data: any, categories: any) {
    this.chartOptions = {
      series: data,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"

        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: categories
      },
      yaxis: {
        title: {
          text: "Meter Count"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "" + val + "";
          }
        }
      }
    };
  }
}
