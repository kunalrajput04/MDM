import { Component, ViewChild, OnInit } from '@angular/core';
import { DlpConApiService } from 'src/app/Service/dlp-con-api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { AgGridAngular } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexMarkers,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: any; // ApexStroke;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dlp',
  templateUrl: './dlp.component.html',
  styleUrls: ['./dlp.component.css']
})
export class DlpComponent implements OnInit {
  title = 'RKDLP';
  consumerNo: any[] = [];
  loading = false;
  selectedFromDate: string = '';
  selectedToDate: string = '';
  data: any[] = [];
  selectedConsumerNo: string = '';
  formattedData: any[] = [];
  defaultColDef: any;
  private gridApi: any;
  private gridColumnApi: any;
  rowData: any[] = []; // Add any appropriate type for your row data  
  gridOptions: any;
  columnDefs: any[] = [
    { field: 'meterSNo', headerName: 'MeterSNo' },
    { field: 'consumerNo', headerName: 'Consumer No' },
    { field: 'consumerName', headerName: 'Consumer Name' },
    { field: 'billingtype', headerName: 'Billing Type' },
    { field: 'formattedDate', headerName: 'Meter Date' },
    { field: 'energyImportKwh', headerName: 'Energy Import Kwh' },
    { field: 'energyImportKwhDifference', headerName: 'Delta Kwh Energy' },
    { field: 'energyImportKvah', headerName: 'Energy Import Kvah' },
    { field: 'energyImportKvahDifference', headerName: 'Delta Kvah Energy' },
    { field: 'energyExportKwh', headerName: 'Energy Export Kwh' },
    { field: 'energyExportKvah', headerName: 'Energy Export Kvah' },
  ];




  formdata = new FormGroup({
    firstMeterSNo: new FormControl(),
    secondMeterSNo: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
    consumerNo: new FormControl(),
  });
  selectedMeterData: any = null;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;


  constructor(
    private storeservice: SmartMeterService,
    private dlpConApiService: DlpConApiService,
    private datePipe: DatePipe
  ) {
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.chartOptions = {
      series: [
        {
          name: "First metersno Kwh",
          type: "column",
          data: []
        },
        {
          name: "second metersno Kwh",
          type: "column",
          data: []
        },
        {
          name: "Variation in %",
          type: "line",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: [],
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime"

      },
      yaxis: {
        title: {
          text: "Energy Kwh"
        },
        min: 0,
        forceNiceScale: true,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => {
            return Math.round(value).toString(); // Display only the integer part of the value
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (y: number) => {
            if (typeof y !== "undefined" && y !== null) {
              return y.toFixed(2) + "Kwh";
            }
            return "";
          }
        }

      }
    };
    this.chartOptions1 = {
      series: [
        {
          name: "First metersno Kvah",
          type: "column",
          data: []
        },
        {
          name: "second metersno Kvah",
          type: "column",
          data: []
        },
        {
          name: "Variation in %",
          type: "line",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: [],
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime"


      },
      yaxis: {
        title: {
          text: "Energy Kvah"
        },
        min: 0,
        forceNiceScale: true,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => {
            return Math.round(value).toString(); // Display only the integer part of the value
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (y: number) => {
            if (typeof y !== "undefined" && y !== null) {
              return y.toFixed(2) + "Kvah";
            }
            return "";
          }
        }

      }
    };
  }

  ngOnInit() {
    this.getConsumerNumbers();
  }

  onSubmit(): void {
    if (this.formdata.valid) {
      this.selectedConsumerNo = this.formdata.get('consumerNo')?.value; // Update to consumerNo
      this.selectedFromDate = this.formdata.get('fromDate')?.value;
      this.selectedToDate = this.formdata.get('toDate')?.value;
      this.getDataForSelectedConsumerAndDateRange();
    } else {
      console.log('Please select all required fields.');
    }
  }

  onGoButtonClick() {
    this.getDataForSelectedConsumerAndDateRange();
  }

  getDataForSelectedConsumerAndDateRange() {
    if (!this.selectedConsumerNo || !this.selectedFromDate || !this.selectedToDate) {
      console.log('Please select consumer number and date range.');
      return;
    }

    const params = {
      fromDate: this.selectedFromDate,
      toDate: this.selectedToDate,
      consumerNo: this.selectedConsumerNo // Update to consumerNo
    };

    this.dlpConApiService.getDataByDateRange(params).subscribe(
      (response: any[]) => {
        this.loading = false;
        this.data = response;
        this.updateChartSeriesData(this.data);
        this.rowData = response.map(item => ({
          ...item,
          formattedDate: this.formatDate(item.dateTime) // Add formattedDate property
        }));
      },
      (error) => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  getConsumerNumbers() {
    this.loading = true;
    this.dlpConApiService.getData().subscribe(
      (response: any[]) => {
        this.loading = false;
        this.consumerNo = response
          .map(item => item.consumerNo)
          .filter(consumerNo => typeof consumerNo === 'string' && consumerNo.length > 4)
          .filter((consumerNo, index, self) => self.indexOf(consumerNo) === index);
      },
      (error) => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  onMeterNoSelected() {
    if (this.selectedFromDate && this.selectedToDate) {
      this.getDataForSelectedConsumerAndDateRange();
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
  formatDate(dateString: string): string {
    const dateObj = new Date(dateString);
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd') || '';
  }



  updateChartSeriesData(data: any[]): void {


    const billingMeters = data.filter(item => item.billingtype === 'Billing Meter');
    const checkMeters = data.filter(item => item.billingtype === 'Check Meter');

    let firstMeterSNo = '';
    let secondMeterSNo = '';

    // Find the firstMeterSNo and secondMeterSNo based on billing meters and check meters
    if (billingMeters.length > 0) {
      firstMeterSNo = billingMeters[0].meterSNo;
      const checkMeter = checkMeters.find(item => item.meterSNo !== firstMeterSNo);
      if (checkMeter) {
        secondMeterSNo = checkMeter.meterSNo;
      }
    } else if (checkMeters.length > 0) {
      firstMeterSNo = checkMeters[0].meterSNo;
      const billingMeter = billingMeters.find(item => item.meterSNo !== firstMeterSNo);
      if (billingMeter) {
        secondMeterSNo = billingMeter.meterSNo;
      }
    }

    const uniqueDates = Array.from(new Set(this.data.map((item) => item.dateTime.slice(0, 10))));

    // Format the dates for chart labels (YYYY-MM-DD)
    const formattedLabels = uniqueDates.map(date => this.formatDate(date));

    // Update the x-axis labels for KWh chart
    const labelsKwh = uniqueDates;
    this.chartOptions.labels = labelsKwh;

    // Update the x-axis labels for KvaH chart
    const labelsKvaH = uniqueDates;
    this.chartOptions1.labels = labelsKvaH;

    // Initialize data arrays with null values for all unique dates
    const firstMeterSNoDataKwh = Array(labelsKwh.length).fill(null);
    const secondMeterSNoDataKwh = Array(labelsKwh.length).fill(null);
    const variationDataKwh = Array(labelsKwh.length).fill(null);

    const firstMeterSNoDataKvaH = Array(labelsKvaH.length).fill(null);
    const secondMeterSNoDataKvaH = Array(labelsKvaH.length).fill(null);
    const variationDataKvaH = Array(labelsKvaH.length).fill(null);

    // Iterate over the API response and populate the data arrays
    this.data.forEach((item) => {
      const dateIndexKwh = labelsKwh.indexOf(item.dateTime.slice(0, 10));
      const dateIndexKvaH = labelsKvaH.indexOf(item.dateTime.slice(0, 10));

      if (item.meterSNo === firstMeterSNo) {
        firstMeterSNoDataKwh[dateIndexKwh] = item.energyImportKwhDifference;
        firstMeterSNoDataKvaH[dateIndexKvaH] = item.energyImportKvahDifference;
      } else if (item.meterSNo === secondMeterSNo) {
        secondMeterSNoDataKwh[dateIndexKwh] = item.energyImportKwhDifference;
        secondMeterSNoDataKvaH[dateIndexKvaH] = item.energyImportKvahDifference;
      }
    });

    // Calculate Variation data for KWh chart
    for (let i = 0; i < labelsKwh.length; i++) {
      if (firstMeterSNoDataKwh[i] !== null && secondMeterSNoDataKwh[i] !== null) {
        const variationPercentageKwh = ((secondMeterSNoDataKwh[i] - firstMeterSNoDataKwh[i]) / firstMeterSNoDataKwh[i]) * 100;
        variationDataKwh[i] = variationPercentageKwh;
      }
    }

    // Calculate Variation data for KvaH chart
    for (let i = 0; i < labelsKvaH.length; i++) {
      if (firstMeterSNoDataKvaH[i] !== null && secondMeterSNoDataKvaH[i] !== null) {
        const variationPercentageKvaH = ((secondMeterSNoDataKvaH[i] - firstMeterSNoDataKvaH[i]) / firstMeterSNoDataKvaH[i]) * 100;
        variationDataKvaH[i] = variationPercentageKvaH;
      }
    }

    // Update the chart series data for KWh chart
    this.chartOptions.series[0].data = firstMeterSNoDataKwh;
    this.chartOptions.series[0].name = firstMeterSNo;

    this.chartOptions.series[1].data = secondMeterSNoDataKwh;
    this.chartOptions.series[1].name = secondMeterSNo;

    this.chartOptions.series[2] = {
      name: "Variation in %",
      type: "line",
      data: variationDataKwh,
    };

    // Update the chart series data for KvaH chart
    this.chartOptions1.series[0].data = firstMeterSNoDataKvaH;
    this.chartOptions1.series[0].name = firstMeterSNo;

    this.chartOptions1.series[1].data = secondMeterSNoDataKvaH;
    this.chartOptions1.series[1].name = secondMeterSNo;

    this.chartOptions1.series[2] = {
      name: "Variation in %",
      type: "line",
      data: variationDataKvaH,
    };
  }

}
