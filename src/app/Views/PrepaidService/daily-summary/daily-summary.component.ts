import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { FilterData } from 'src/app/Model/meter-data';
import { PrepaidDailySummary } from 'src/app/Model/prepaid-daily-summary';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { RevenueService } from 'src/app/Service/revenue.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';




@Component({
  selector: 'app-daily-summary',
  templateUrl: './daily-summary.component.html',
  styleUrls: ['./daily-summary.component.css']
})
export class DailySummaryComponent implements OnInit {

   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Prepaid Service',
    levelurl: '',
    menuname: 'Daily Summary',
    url: '/mdm/PrepaidService/',
  };

 
  
  formdata: FilterData = new FilterData();

  lables: any = [];
  deltalables: any = [];
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  levelValue: string;
  levelName: string;

  title = 'AgGrid';
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  rowData: any;
  gridOptions: any;
  defaultColDef: any;

  data: PrepaidDailySummary[] = [];



  
  constructor(
    private service: RevenueService,  
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private toastr: ToastrService,
    private authservice: AuthService,
    @Inject(LOCALE_ID) private locale: string
  ) { 
    this.authservice.chagneHeaderNav(this.datas);
    this.levelValue=localStorage.getItem('AccessLevel');
    this.levelName=localStorage.getItem('AccessValue');

    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true }

    this.columnDefs = [
    
      { headerName: 'Consumer No', field: 'meterSerialNo', cellStyle: {'font-weight': '600', 'font-size': '14px'} },
      { headerName: 'Reading At', field: 'readingDate',cellStyle: {'font-weight': '600', 'font-size': '14px'},cellRenderer: (data) => { return formatDate(data.value, 'd MMM yyyy HH:mm:a', this.locale);}  },
      { headerName: 'Unit Consumed(Kwh)', field: 'consumeUnitkwh',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Current Reading', field: 'currentReading',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Last Reading', field: 'lastReading',cellStyle: {'font-weight': '600', 'font-size': '14px'} },               
      { headerName: '(₹) Current Balance', field: 'currentBalance',cellStyle: {'font-weight': '600', 'font-size': '14px'} },                          
      { headerName: '(₹) Last Balance', field: 'lastBalance' ,cellStyle: {'font-weight': '600', 'font-size': '14px'}},      
      { headerName: 'Balance Updated', field: 'commandCreated',cellStyle: {'font-weight': '600', 'font-size': '14px'},cellRenderer: (data) => { return formatDate(data.value, 'd MMM yyyy HH:mm:ss:a', this.locale); } },    
      { headerName: 'Command Status', field: 'isCommandExecuted',cellStyle: {'font-weight': '600', 'font-size': '14px'} },         
      { headerName: 'Meter Status', field: 'isActive',cellStyle: {'font-weight': '600', 'font-size': '14px'} },   
      { headerName: 'Remarks', field: 'remarks',cellStyle: {'font-weight': '600', 'font-size': '14px'} },     
      
    ];
  }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 6);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

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

  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  onBtnUpdate() {
    var eGridDiv = document.querySelector('#csvResult');
    eGridDiv = this.gridApi.getDataAsCsv();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.service.getDailySummary().subscribe((res: any) => {    
      if (res.success == true && res.data != null) {
        this.data = res.data;       
        this.gridApi.setRowData(res.data);
      }
    });
  }


}
