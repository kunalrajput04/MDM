import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MeterDat } from 'src/app/Model/meter-datas';

//pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import htmlToPdfmake from 'html-to-pdfmake';
// import html2canvas from 'html2canvas';

import { DataService } from 'src/app/Service/data.service';
//import { DataService } from 'src/app/Services/data.service';

export interface sytemLogInfo {
  month: string;
  availability: string;
  s1_fail_hours: string;
  s1_pass_hours: string;
  s2_fail_hours: string;
  s2_pass_hours: string;
  s3_fail_hours: string;
  s3_pass_hours: string;
  total_hours: string;
}

@Component({
  selector: 'app-system-att',
  templateUrl: './system-att.component.html',
  styleUrls: ['./system-att.component.css'],
})
export class SystemAttComponent implements OnInit {
  formdata: MeterDat = new MeterDat();
  levelName: string = 'ALL';
  levelValue: string = 'MPDCL';
  //startDate: string = "2022-10-14";
  //endDate: string = "2023-12-28";
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  paginationPageSize: number = 14;
  resultData: any;
  slaData: sytemLogInfo[] = [];
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private slaDataService: DataService,
    private router: Router
  ) {
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.columnDefs = [
      { field: 'month', headerName: 'Month' },
      { field: 's1_fail_hours', headerName: 'S1 Fail Hrs' },
      { field: 's1_pass_hours', headerName: 'S1 Pass Hrs' },
      { field: 's2_fail_hours', headerName: 'S2 Fail Hrs' },
      { field: 's2_pass_hours', headerName: 'S2 Pass Hrs' },
      { field: 's3_fail_hours', headerName: 'S3 Fail Hrs' },
      { field: 's3_pass_hours', headerName: 'S3 Pass Hrs' },
      { field: 'total_hours', headerName: 'Total Hrs' },
      { field: 'availability', headerName: 'Availability' },
    ];
  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  onSubmit() {
    this.slaDataService
      .getSystemLog(
        this.levelName,
        this.levelValue,
        this.formdata.fromdate,
        this.formdata.todate
      )
      .subscribe((res: any) => {
        if (
          res != null &&
          res.message != 'Key Is Not Valid' &&
          res.message != 'Session Is Expired'
        ) {
          if (res.data != null) {
            this.resultData = res.data[0];

            for (let item in this.resultData) {
              if (parseInt(item) !== 1) {
                this.slaData.push({
                  month: this.resultData[item][0],
                  s1_fail_hours: this.resultData[item][2],
                  s1_pass_hours: this.resultData[item][3],
                  s2_fail_hours: this.resultData[item][4],
                  s2_pass_hours: this.resultData[item][5],
                  s3_fail_hours: this.resultData[item][6],
                  s3_pass_hours: this.resultData[item][7],
                  total_hours: this.resultData[item][8],
                  availability: this.resultData[item][1],
                });
              }
              // else{
              //   this.logout();
              // }
            }
            //table creation
            this.gridApi.setRowData(this.slaData);
            this.gridColumnApi.autoSizeAllColumns();
          }
        }
      });
  }
  // logout(){
  //   sessionStorage.clear();
  //   localStorage.clear();
  //   this.router.navigate(['/meecl']);
  // }
  convertpdf() {
    //alert("sla history report")
    // this.beforePrint();
    var date = new Date();
    this.datePipe.transform(date, 'dd-MM-yyyy');

    // html2canvas(document.getElementById('#printingsection')).then((canvas) => {
    // Few necessary setting options

    // const contentDataURL = canvas.toDataURL('image/png');
    // let pdf = new jsPDF('l', 'pt', 'a4'); // A4 size page of PDF
    //   var width = pdf.internal.pageSize.getWidth();
    //   var height = (canvas.height * width) / canvas.width;
    //   pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
    //   pdf.save(
    //     'SLAHistoryReport' +
    //       this.datePipe.transform(date, 'dd-MM-yyyy') +
    //       '.pdf'
    //   ); // Generated PDF
    // });

    //  this.afterPrint();
  }
  beforePrint() {
    $('.page-header,.noprint').hide();
    $('.center,.print').show();
  }

  afterPrint() {
    $('.page-header,.noprint').show();
    $('.center,.print').hide();
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'SystemAvailability.csv',
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
}
