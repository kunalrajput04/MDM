import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PrepaidDailySummary } from 'src/app/Model/prepaid-daily-summary';
import { AuthService } from 'src/app/Service/auth.service';
import { RevenueService } from 'src/app/Service/revenue.service';

@Component({
  selector: 'app-prepaid-daily-summary',
  templateUrl: './prepaid-daily-summary.component.html',
  styleUrls: ['./prepaid-daily-summary.component.css']
})
export class PrepaidDailySummaryComponent implements OnInit {


   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Prepaid Daily Summary',
    url: '/mdm/revenue/',
  };

  //#endregion

  title = 'AgGrid';
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  rowData: any;
  gridOptions: any;
  defaultColDef: any;

  data: PrepaidDailySummary[] = [];

  constructor(
    private toastr: ToastrService,
    private service: RevenueService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    @Inject(LOCALE_ID) private locale: string
  ) { 

    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true }

    this.columnDefs = [
    
      { headerName: 'Meter S_NO', field: 'meterSerialNo', cellStyle: {'font-weight': '600', 'font-size': '14px'} },
      { headerName: 'MDAS', field: 'mdas',cellStyle: {'font-weight': '600', 'font-size': '14px'},cellRenderer: (data) => { return formatDate(data.value, 'd MMM yyyy HH:mm:a', this.locale); } },
      { headerName: 'Energy Import (Kwh)', field: 'energyImportKwh',cellStyle: {'font-weight': '600', 'font-size': '14px'} },
      { headerName: 'Energy Import (Kvah)', field: 'energyImportKvah',cellStyle: {'font-weight': '600', 'font-size': '14px'} },
      { headerName: 'Energy Export (Kwh)', field: 'energyExportKwh' ,cellStyle: {'font-weight': '600', 'font-size': '14px'}},
      { headerName: 'Energy Export (Kvah)', field: 'energyExportKvah',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Meter Type', field: 'meterType',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Current Balance', field: 'currentBalance',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Last Balance', field: 'lastBalance',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Last Recharge', field: 'lastRecharge',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Current Reading', field: 'currentReading',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Last Reading', field: 'lastReading',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Command SentAt', field: 'commandSent',cellStyle: {'font-weight': '600', 'font-size': '14px'},cellRenderer: (data) => { return formatDate(data.value, 'd MMM yyyy HH:mm:a', this.locale); } },    
      { headerName: 'Last Command', field: 'lastCommand',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Command Status', field: 'isCommandExecuted',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Meter Status', field: 'isActive',cellStyle: {'font-weight': '600', 'font-size': '14px'} },    
      { headerName: 'Last Updated', field: 'created',cellStyle: {'font-weight': '600', 'font-size': '14px'},cellRenderer: (data) => { return formatDate(data.value, 'd MMM yyyy HH:mm:a', this.locale); } },    


    ];
  }

  ngOnInit(): void {
  
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
