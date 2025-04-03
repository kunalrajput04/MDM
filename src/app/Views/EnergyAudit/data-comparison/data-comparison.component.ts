import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
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

// Interface
export interface IFilterData {
  fromdate: string;
  todate: string;
  meterNo: string;
  accessLevel: string;
  dataRange: string;
  subdivisonName1: string;
  subdivisonName2: string;
  subdivisionwise: string;
  feederName: string;
  dtName: string;
}
@Component({
  selector: 'app-data-comparison',
  templateUrl: './data-comparison.component.html',
  styleUrls: ['./data-comparison.component.css'],
})
export class DataComparisonComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Energy',
    levelurl: '',
    menuname: 'Data Analysis',
    url: '/mdm/vee/',
  };

  //#endregion

  formdata: IFilterData = {
    accessLevel: 'CONSUMER',
    dataRange: 'DAILY',
    fromdate: '',
    meterNo: '',
    todate: '',
    dtName: '',
    feederName: '',
    subdivisonName1: '',
    subdivisonName2: '',
    subdivisionwise: 'subdivision wise',
  };
  headerdata = [];
  rowdata = [];
  isSubmit: boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  @ViewChild('chart') chart: ChartComponent;

  public chartOptions2: Partial<ChartOptions>;
  
  lables: any = [];
  lables2: any = [];
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
  
     // New DataAnalysis Comparison
     this.chartOptions2 = {
      series: [{
        name: 'Subdivision 1 KVAH',
        data: [44, 55, 57]
      }, {
        name: 'Subdivision 1 KWH',
        data: [76, 85, 101]
      }, {
        name: 'Subdivision 2 KVAH',
        data: [35, 41, 36]
      },{
        name: 'Subdivision 2 KWH',
        data: [44, 55, 57]
      },],
        chart: {
        type: 'bar',
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position:'right',
        offsetX: -25,
        offsetY: 30,
        markers: {
          radius: 0,
      },
      },
      stroke: {
        show: true,
        width:[ 1,2,1],
        colors: ['transparent']
      },
      xaxis: {
        categories: ['19 May', '20 May', '21 May'],
        axisBorder:{
          show:true,
          color:"#808080"
        },
      },
      yaxis: {
        axisBorder:{
          show:true,
          color:"#808080"
        },
      },
      fill: {
        opacity: 1
      },
   }
  }
  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.meterNo = '11011846';
    // this.getBilling(this.formdata.fromdate, this.formdata.todate);
  }
 

  
  // getBilling(from: any, to: any) {
  //   if (from == null && to == null) {
  //     from = new Date();
  //     to = new Date();
  //   } else {
  //     from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
  //     to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');
  //     let currentDate;
  //     let obj = [];
  //     let deltaobj = [];
  //     this.service
  //       .getDailyLoadProfileDataForChart(
  //         from,
  //         to,
  //         this.levelName,
  //         this.levelValue
  //       )
  //       .subscribe((res: any) => {
  //         this.headerdata = res.data[0][1];
  //         this.rowdata = [];
  //         this.lables.length = 0;
  //         this.lables2.length = 0;
  //         this.deltalables.length = 0;
  //         for (let item in res.data[0]) {
  //           if (parseInt(item) !== 1) {
  //             this.rowdata.push(res.data[0][item]);
  //             let data = this.datePipe.transform(
  //               res.data[0][item][1],
  //               'yyyy-MM-dd'
  //             );
  //             if (data !== currentDate) {
  //               currentDate = data;
  //               //#region  Cumlative Chart Logic
  //               this.lables.push(data);
  //               // new DataAnalysis
  //               var date2 = new Date(res.data[0][item][1]);
  //               function formatDate(date) {
  //                 var months = [
  //                   'Jan',
  //                   'Feb',
  //                   'Mar',
  //                   'Apr',
  //                   'May',
  //                   'Jun',
  //                   'Jul',
  //                   'Aug',
  //                   'Sep',
  //                   'Oct',
  //                   'Nov',
  //                   'Dec',
  //                 ];
  //                 // var year = date.getFullYear();
  //                 var d = date.getDate();
  //                 var month = months[date.getMonth()];
  //                 return d + '-' + month;
  //               }
  //               //
  //               this.lables2.push(formatDate(date2));

  //               // New DataAnalysis comparison chartOptions2
  //               this.chartOptions2.series = [
  //                 {
  //                   name: 'Import (kwh)',
  //                   data: obj.map((a) => a.importkwh),
  //                 },
  //                 {
  //                   name: 'Import (kvah)',
  //                   data: obj.map((a) => a.importkvahdata),
  //                 },
  //               ];
  //             } else {
  //             }
  //           }
  //         }
  //       });
  //   }
  // }

  onSubmit(form: NgForm) {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
    // this.rerender(this.formdata.fromdate, this.formdata.todate);
  }

  // getSubdivision() {
  //   this.subdivisionservice.getSubdivision().subscribe(
  //     (res: any) => {
  //       this.subdivisionDropDown = [];
  //       let obj = res.data[0];
  //       for (var item in obj) {
  //         this.subdivisionDropDown.push(obj[item][0]);
  //         console.log( this.subdivisionDropDown.push(obj[item][0]))
  //       }
  //     },
  //     (err) => {
  //       this.toastr.error('Oops! Something Went Wrong.');
  //     }
  //   );
  // }
  // 
  
}
