// import { DatePipe } from '@angular/common';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { Router } from '@angular/router';
// import { DataTableDirective } from 'angular-datatables';
// import { ChartComponent } from 'ng-apexcharts';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
// import { Subject } from 'rxjs';
// import { MeterData } from 'src/app/Model/meter-data';
// import { DataSharedService } from 'src/app/Service/data-shared.service';
// import { DataService } from 'src/app/Service/data.service';
// import { DTService } from 'src/app/Service/dt.service';
// import { FeederService } from 'src/app/Service/feeder.service';
// import { SubdivisionService } from 'src/app/Service/subdivision.service';
// import { SubstationService } from 'src/app/Service/substation.service';
// import { ChartOptions } from 'src/app/Shared/chartoptions';
// export interface IFilterData {
//   fromdate: string;
//   todate: string;
//   meterNo: string;
//   accessLevel: string;
//   dataRange: string;
//   subdivisonName: string;
//   substationName: string;
//   feederName: string;
//   dtName: string;
// }
// @Component({
//   selector: 'app-data-analysis',
//   templateUrl: './data-analysis.component.html',
//   styleUrls: ['./data-analysis.component.css'],
// })
// export class DataAnalysisComponent implements OnInit {
//   formdata: IFilterData = {
//     accessLevel: 'CONSUMER',
//     dataRange: 'DAILY',
//     fromdate: '',
//     meterNo: '',
//     todate: '',
//     dtName: '',
//     feederName: '',
//     subdivisonName: '',
//     substationName: '',
//   };
//   headerdata = [];
//   rowdata = [];
//   isSubmit: boolean = false;
//   dtOptions: any = {};
//   dtTrigger: Subject<any> = new Subject<any>();
//   @ViewChild(DataTableDirective, { static: false })
//   dtElement: DataTableDirective;
//   @ViewChild('chart') chart: ChartComponent;
//   public chartOptions: Partial<ChartOptions>;
//   public chartOptions1: Partial<ChartOptions>;
//   public chartOptions2: Partial<ChartOptions>;
//   lables: any = [];
//   subdivisionDropDown: any[] = [];
//   substatioDropDown: any[] = [];
//   feederDropDown: any[] = [];
//   dtDropDown: any[] = [];
//   levelValue: string;
//   levelName: string;
//   constructor(
//     private service: DataService,
//     private router: Router,
//     private spinner: NgxSpinnerService,
//     private datePipe: DatePipe,
//     private datasharedservice: DataSharedService,
//     private subdivisionservice: SubdivisionService,
//     private substation: SubstationService,
//     private feederservice: FeederService,
//     private dtservice: DTService,
//     private toastr: ToastrService
//   ) {
//     this.chartOptions = {
//       series: [
//         {
//           name: 'Import (kwh)',
//           data: [],
//         },
//         {
//           name: 'Export (kwh)',
//           data: [],
//         },
//         {
//           name: 'Import (kvah)',
//           data: [],
//         },
//         {
//           name: 'Export (kvah)',
//           data: [],
//         },
//       ],
//       chart: {
//         type: 'bar',
//         height: 350,
//         stacked: true,
//         toolbar: {
//           show: true,
//         },
//         zoom: {
//           enabled: false,
//         },
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             legend: {
//               position: 'bottom',
//               offsetX: -10,
//               offsetY: 0,
//             },
//           },
//         },
//       ],
//       yaxis: {
//         labels: {
//           formatter: function (val, index) {
//             return val.toFixed(2);
//           },
//         },
//       },

//       plotOptions: {
//         bar: {
//           horizontal: false,
//         },
//       },
//       xaxis: {
//         type: 'category',

//         categories: this.lables,
//       },
//       dataLabels: {
//         enabled: true,

//         formatter: function (val, index) {
//           let vall = val as number;
//           return vall.toFixed(2);
//         },
//         offsetX: 0,
//       },
//       legend: {
//         position: 'right',
//         offsetY: 40,
//       },
//       fill: {
//         opacity: 1,
//       },
//     };
//     this.chartOptions1 = {
//       series: [
//         {
//           name: 'Import (kwh)',
//           data: [],
//         },
//         {
//           name: 'Export (kwh)',
//           data: [],
//         },
//         {
//           name: 'Import (kvah)',
//           data: [],
//         },
//         {
//           name: 'Export (kvah)',
//           data: [],
//         },
//       ],
//       chart: {
//         id: 'chart2',
//         type: 'line',
//         height: 350,
//         zoom: {
//           enabled: false,
//         },
//         toolbar: {
//           autoSelected: 'pan',
//           show: false,
//         },
//       },
//       colors: ['#546E7A', '#0cb9ed', '#ed091c', '#4287f5'],
//       stroke: {
//         width: 3,
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       fill: {
//         opacity: 1,
//       },
//       markers: {
//         size: 0,
//       },
//       xaxis: {
//         type: 'datetime',
//       },
//       yaxis: {
//         labels: {
//           formatter: function (val, index) {
//             return val.toFixed(2);
//           },
//         },
//       },
//     };

//       // New DataAnalysis Comparison 
//       this.chartOptions2 = {
//         series: [
//         {
//           name: 'Import (kwh)',
//           type: 'column',
//           data: [],
//         },
//         ]
//     }
//   }

//   ngOnInit(): void {
//     let obj = this;
//     this.dtOptions = {
//       pagingType: 'full_numbers',
//       pageLength: 10,
//       lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
//       scrollY: 400,
//       scrollX: true,
//       dom: 'lBfrtip',
//       processing: true,

//       buttons: [
//         { extend: 'excel', title: 'Billing Data' },

//         { extend: 'pdf', title: 'Billing Data' },
//         {
//           text: 'Refresh',
//           action: function () {
//             obj.rerender(obj.formdata.fromdate, obj.formdata.todate);
//           },
//         },
//       ],
//     };

//     let date = new Date();
//     date.setDate(date.getDate() - 7);
//     this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
//     this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
//     this.formdata.meterNo = '11011846';
//     this.setLevelValueName();
//     this.getBilling(this.formdata.fromdate, this.formdata.todate);
//   }

//   getBilling(from: any, to: any) {
//     if (from == null && to == null) {
//       from = new Date();
//       to = new Date();
//     } else {
//       from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
//       to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');
//       let currentDate;
//       let obj = [];
//       this.service
//         .getDailyLoadProfileDataForChart(
//           from,
//           to,
//           this.levelName,
//           this.levelValue
//         )
//         .subscribe(
//           (res: any) => {
//             if (res != null && res.message != 'Key Is Not Valid') {
//               this.headerdata = res.data[0][1];
//               this.rowdata = [];
//               this.lables.length = 0;

//               let mainImportData = [];
//               let mainImportKvahData = [];
//               let mainExportData = [];
//               let mainExportKvahData = [];
//               let storeData = false;
//               let previousLable;
//               let previousImportKwh;
//               let previousImportKvah;
//               let previousExportKwh;
//               let previousExportKvah;
//               for (let item in res.data[0]) {
//                 let importdata = [];
//                 let importkvahdata = [];
//                 let exportdata = [];
//                 let exportkvahdata = [];

//                 if (parseInt(item) !== 1) {
//                   //Cumlative Chart Logic
//                   let data = this.datePipe.transform(
//                     res.data[0][item][1],
//                     'yyyy-MM-dd'
//                   );
//                   if (data !== currentDate) {
//                     currentDate = data;
//                     this.lables.push(data);
//                     obj.push({
//                       date: data,
//                       importkwh: res.data[0][item][3],
//                       importkvahdata: res.data[0][item][4],
//                       exportdata: res.data[0][item][5],
//                       exportkvahdata: res.data[0][item][6],
//                     });
//                   } else {
//                     let objIndex = obj.findIndex((obj) => obj.date == data);
//                     obj[objIndex].importkwh =
//                       obj[objIndex].importkwh + res.data[0][item][3];
//                     obj[objIndex].importkvahdata =
//                       obj[objIndex].importkvahdata + res.data[0][item][4];
//                     obj[objIndex].exportdata =
//                       obj[objIndex].exportdata + res.data[0][item][5];
//                     obj[objIndex].exportkvahdata =
//                       obj[objIndex].exportkvahdata + res.data[0][item][6];
//                   }

//                   //Cumlative Chart Logic end

//                   //Delta Chart Logic

//                   if (storeData) {
//                     //import kwh
//                     let value = res.data[0][item][3];
//                     previousImportKwh = previousImportKwh - value;

//                     importdata.push(previousLable);
//                     importdata.push(previousImportKwh);
//                     mainImportData.push(importdata);

//                     //import kvah
//                     let valuekvah = res.data[0][item][4];
//                     previousImportKvah = previousImportKvah - valuekvah;
//                     importkvahdata.push(previousLable);
//                     importkvahdata.push(previousImportKvah);
//                     mainImportKvahData.push(importkvahdata);

//                     //export kwh
//                     let valueexport = res.data[0][item][5];
//                     previousExportKwh = previousExportKwh - valueexport;
//                     exportdata.push(previousLable);
//                     exportdata.push(previousExportKwh);
//                     mainExportData.push(exportdata);

//                     //export kvah
//                     let valueexportkvah = res.data[0][item][6];
//                     previousExportKvah = previousExportKvah - valueexportkvah;
//                     exportkvahdata.push(previousLable);
//                     exportkvahdata.push(previousExportKvah);
//                     mainExportKvahData.push(exportkvahdata);

//                     previousLable = new Date(res.data[0][item][1]).getTime();
//                     previousImportKwh = value;
//                     previousImportKvah = valuekvah;
//                     previousExportKwh = valueexport;
//                     previousExportKvah = valueexportkvah;
//                   } else {
//                     storeData = true;
//                     previousLable = new Date(res.data[0][item][1]).getTime();

//                     //import kwh
//                     let value = res.data[0][item][3];
//                     previousImportKwh = value;

//                     //import kvah
//                     let valuekvah = res.data[0][item][4];
//                     previousImportKvah = valuekvah;

//                     //export kwh
//                     let valueexport = res.data[0][item][5];
//                     previousExportKwh = valueexport;

//                     //export kvah
//                     let valueexportkvah = res.data[0][item][6];
//                     previousExportKvah = valueexportkvah;
//                     //Delta Chart Logic end

//                     this.rowdata.push(res.data[0][item]);
//                   }
//                 }
//               }

//               this.dtTrigger.next();
//               this.chartOptions1.series = [
//                 {
//                   name: 'Import (kwh)',
//                   data: mainImportData,
//                 },
//                 {
//                   name: 'Export (kwh)',
//                   data: mainExportData,
//                 },
//                 {
//                   name: 'Import (kvah)',
//                   data: mainImportKvahData,
//                 },
//                 {
//                   name: 'Export (kvah)',
//                   data: mainExportKvahData,
//                 },
//               ];
//               this.chartOptions.series = [
//                 {
//                   name: 'Import (kwh)',
//                   data: obj.map((a) => a.importkwh),
//                 },
//                 {
//                   name: 'Export (kwh)',
//                   data: obj.map((a) => a.exportdata),
//                 },
//                 {
//                   name: 'Import (kvah)',
//                   data: obj.map((a) => a.importkvahdata),
//                 },
//                 {
//                   name: 'Export (kvah)',
//                   data: obj.map((a) => a.exportkvahdata),
//                 },
//               ];
//             } else {
//               //this.logout();
//             }
//           },
//           (err) => {
//             this.toastr.error('Oops! Something Went Wrong.');
//           }
//         );
//     }
//   }
//   getBillingForWeekly(from: any, to: any) {
//     let currentDate;
//     let obj = [];
//     let getWeekDay = this.getDaysBetweenDates(
//       this.formdata.fromdate,
//       this.formdata.todate,
//       'sun'
//     );
//     this.service
//       .getDailyLoadProfileDataForChart(
//         from,
//         to,
//         this.levelName,
//         this.levelValue
//       )
//       .subscribe(
//         (res: any) => {
//           if (res != null && res.message != 'Key Is Not Valid') {
//             this.headerdata = res.data[0][1];
//             this.rowdata = [];
//             this.lables.length = 0;
//             for (let item in res.data[0]) {
//               if (parseInt(item) !== 1) {
//                 let data = this.datePipe.transform(
//                   res.data[0][item][1],
//                   'yyyy-MM-dd'
//                 );
//                 let check = getWeekDay.includes(data);
//                 if (check) {
//                   this.rowdata.push(res.data[0][item]);
//                   if (data !== currentDate) {
//                     currentDate = data;
//                     this.lables.push(data);
//                     obj.push({
//                       date: data,
//                       importkwh: res.data[0][item][3],
//                       importkvahdata: res.data[0][item][4],
//                       exportdata: res.data[0][item][5],
//                       exportkvahdata: res.data[0][item][6],
//                     });
//                   } else {
//                     let objIndex = obj.findIndex((obj) => obj.date == data);
//                     obj[objIndex].importkwh =
//                       obj[objIndex].importkwh + res.data[0][item][3];
//                     obj[objIndex].importkvahdata =
//                       obj[objIndex].importkvahdata + res.data[0][item][4];
//                     obj[objIndex].exportdata =
//                       obj[objIndex].exportdata + res.data[0][item][5];
//                     obj[objIndex].exportkvahdata =
//                       obj[objIndex].exportkvahdata + res.data[0][item][6];
//                   }
//                 }
//               }
//             }
//             this.dtTrigger.next();
//             this.chartOptions.series = [
//               {
//                 name: 'Import (kwh)',
//                 data: obj.map((a) => a.importkwh),
//               },
//               {
//                 name: 'Export (kwh)',
//                 data: obj.map((a) => a.exportdata),
//               },
//               {
//                 name: 'Import (kvah)',
//                 data: obj.map((a) => a.importkvahdata),
//               },
//               {
//                 name: 'Export (kvah)',
//                 data: obj.map((a) => a.exportkvahdata),
//               },
//             ];
//           } else {
//             //this.logout();
//           }
//         },
//         (err) => {
//           this.toastr.error('Oops! Something Went Wrong.');
//         }
//       );
//   }
//   getBillingForMonthly(from: any, to: any) {
//     let currentDate;
//     let obj = [];

//     this.service
//       .getDailyLoadProfileDataForChart(
//         from,
//         to,
//         this.levelName,
//         this.levelValue
//       )
//       .subscribe(
//         (res: any) => {
//           if (res != null && res.message != 'Key Is Not Valid') {
//             this.headerdata = res.data[0][1];
//             this.rowdata = [];
//             this.lables.length = 0;
//             for (let item in res.data[0]) {
//               if (parseInt(item) !== 1) {
//                 let data = this.datePipe.transform(
//                   res.data[0][item][1],
//                   'yyyy-MM-dd'
//                 );
//                 let firstdate = this.datePipe.transform(
//                   res.data[0][item][1],
//                   'dd'
//                 );
//                 if (firstdate == '01') {
//                   if (data !== currentDate) {
//                     currentDate = data;
//                     this.lables.push(data);
//                     obj.push({
//                       date: data,
//                       importkwh: res.data[0][item][3],
//                       importkvahdata: res.data[0][item][4],
//                       exportdata: res.data[0][item][5],
//                       exportkvahdata: res.data[0][item][6],
//                     });
//                   } else {
//                     let objIndex = obj.findIndex((obj) => obj.date == data);
//                     obj[objIndex].importkwh =
//                       obj[objIndex].importkwh + res.data[0][item][3];
//                     obj[objIndex].importkvahdata =
//                       obj[objIndex].importkvahdata + res.data[0][item][4];
//                     obj[objIndex].exportdata =
//                       obj[objIndex].exportdata + res.data[0][item][5];
//                     obj[objIndex].exportkvahdata =
//                       obj[objIndex].exportkvahdata + res.data[0][item][6];
//                   }

//                   this.rowdata.push(res.data[0][item]);
//                 }
//               }
//             }
//             this.dtTrigger.next();
//             this.chartOptions.series = [
//               {
//                 name: 'Import (kwh)',
//                 data: obj.map((a) => a.importkwh),
//               },
//               {
//                 name: 'Export (kwh)',
//                 data: obj.map((a) => a.exportdata),
//               },
//               {
//                 name: 'Import (kvah)',
//                 data: obj.map((a) => a.importkvahdata),
//               },
//               {
//                 name: 'Export (kvah)',
//                 data: obj.map((a) => a.exportkvahdata),
//               },
//             ];
//           } else {
//             //this.logout();
//           }
//         },
//         (err) => {
//           this.toastr.error('Oops! Something Went Wrong.');
//         }
//       );
//   }

//   getDaysBetweenDates(start, end, dayName): any {
//     start = new Date(start);
//     end = new Date(end);
//     var result = [];
//     var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
//     var day = days[dayName.toLowerCase().substr(0, 3)];
//     // Copy start date
//     var current = new Date(start);
//     // Shift to next of required days
//     current.setDate(current.getDate() + ((day - current.getDay() + 7) % 7));
//     // While less than end date, add dates to result array
//     while (current < end) {
//       result.push(this.datePipe.transform(current, 'yyyy-MM-dd'));
//       current.setDate(current.getDate() + 7);
//     }
//     return result;
//   }

//   setLevelValueName() {
//     if (this.formdata.accessLevel == 'CONSUMER') {
//       this.levelValue = this.formdata.meterNo;
//       this.levelName = 'METER';
//     } else if (this.formdata.accessLevel == 'SUBDIVISION') {
//       this.levelValue = this.formdata.subdivisonName;
//       this.levelName = 'SUBDEVISION';
//     } else if (this.formdata.accessLevel == 'SUBSTATION') {
//       this.levelValue = this.formdata.substationName;
//       this.levelName = 'SUBSTATION';
//     } else if (this.formdata.accessLevel == 'FEEDER') {
//       this.levelValue = this.formdata.feederName;
//       this.levelName = 'FEEDER';
//     } else if (this.formdata.accessLevel == 'DT') {
//       this.levelValue = this.formdata.dtName;
//       this.levelName = 'DT';
//     }
//   }
//   rerender(from: any, to: any): void {
//     // if (this.isSubmit) {

//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//       dtInstance.destroy();
//     });
//     // }
//     // this.isSubmit = true;

//     if (this.formdata.dataRange == 'DAILY') this.getBilling(from, to);
//     else if (this.formdata.dataRange == 'WEEKLY')
//       this.getBillingForWeekly(from, to);
//     else if (this.formdata.dataRange == 'MONTHLY')
//       this.getBillingForMonthly(from, to);
//   }

//   onSubmit(form: NgForm) {
//     this.formdata.fromdate = this.datePipe.transform(
//       new Date(this.formdata.fromdate),
//       'yyyy-MM-dd'
//     );
//     this.formdata.todate = this.datePipe.transform(
//       new Date(this.formdata.todate),
//       'yyyy-MM-dd'
//     );
//     this.setLevelValueName();
//     this.rerender(this.formdata.fromdate, this.formdata.todate);
//   }

//   public generateDayWiseTimeSeries = function (baseval, count, yrange) {
//     var i = 0;
//     var series = [];
//     while (i < count) {
//       var x = baseval;
//       var y =
//         Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

//       series.push([x, y]);
//       baseval += 86400000;
//       i++;
//     }
//     return series;
//   };

//   getSubdivision() {
//     this.subdivisionservice.getSubdivision().subscribe(
//       (res: any) => {
//         if (res != null) {
//           this.subdivisionDropDown = [];
//           let obj = res.data[0];
//           for (var item in obj) {
//             this.subdivisionDropDown.push(obj[item][0]);
//           }
//         }
//       },
//       (err) => {
//         this.toastr.error('Oops! Something Went Wrong.');
//       }
//     );
//   }
//   getSubstation(subdivision: string) {
//     this.substation.getSubstationBySubdivision(subdivision).subscribe(
//       (res: any) => {
//         this.substatioDropDown = [];
//         if (res.data != null) {
//           let obj = res.data[0];
//           for (var item in obj) {
//             this.substatioDropDown.push(obj[item][0]);
//           }
//         }
//       },
//       (err) => {
//         this.toastr.error('Oops! Something Went Wrong.');
//       }
//     );
//   }
//   getFeeder(substation: string) {
//     this.feederservice.getFeederBySubstation(substation).subscribe(
//       (res: any) => {
//         this.feederDropDown = [];
//         if (res.data != null) {
//           let obj = res.data[0];
//           for (var item in obj) {
//             this.feederDropDown.push(obj[item][0]);
//           }
//         }
//       },
//       (err) => {
//         this.toastr.error('Oops! Something Went Wrong.');
//       }
//     );
//   }
//   getDT(feeder: string) {
//     this.dtservice.getDTByFeeder(feeder).subscribe(
//       (res: any) => {
//         this.dtDropDown = [];
//         if (res.data != null) {
//           let obj = res.data[0];
//           for (var item in obj) {
//             this.dtDropDown.push(obj[item][0]);
//           }
//         }
//       },
//       (err) => {
//         this.toastr.error('Oops! Something Went Wrong.');
//       }
//     );
//   }
//   accessLevelChange() {
//     if (this.formdata.accessLevel != 'CONSUMER') {
//       this.getSubdivision();
//     }
//   }
// }
