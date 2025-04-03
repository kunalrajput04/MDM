import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LowBalanceMeters } from 'src/app/Model/consumer-meter-info';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';

@Component({
  selector: 'app-low-balance-consumer',
  templateUrl: './low-balance-consumer.component.html',
  styleUrls: ['./low-balance-consumer.component.css'],
})
export class LowBalanceConsumerComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Prepaid Service',
    levelurl: '',
    menuname: 'Low Balance',
    url: '/mdm/PrepaidService/',
  };

  title = 'AgGrid';
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  rowData: any;
  gridOptions: any;
  defaultColDef: any;

  data: LowBalanceMeters[] = [];

  constructor(
    private service: PrepaidService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private authservice: AuthService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.authservice.chagneHeaderNav(this.datas);   
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true };

    this.columnDefs = [
      {
        headerName: 'Consumer No',
        field: 'customerNo',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },

     

      {
        headerName: '(₹) Current Balance',
        field: 'currentBalance',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },

      {
        headerName: '(₹) Last Balance',
        field: 'lastBalance',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },

      {
        headerName: 'Unit Consumed(Kwh)',
        field: 'consumeUnitkwh',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },

     
     
      {
        headerName: 'Current Reading',
        field: 'currentReading',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Last Reading',
        field: 'lastReading',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      
      
    ];
  }

  ngOnInit(): void {}

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
    this.service.GetLowBalanceConsumers().subscribe((res: any) => {    
      if (res.success == true && res.data != null) {
        this.data = res.data;       
        this.gridApi.setRowData(res.data);
      }
    });
  }


}
