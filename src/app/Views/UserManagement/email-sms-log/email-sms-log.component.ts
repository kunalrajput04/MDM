import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgridRequest } from 'src/app/Model/DataTablesResponse';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-email-sms-log',
  templateUrl: './email-sms-log.component.html',
  styleUrls: ['./email-sms-log.component.css'],
})
export class EmailSmsLogComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu;

  //#endregion
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  dataList: any = [];

  agridRequest: AgridRequest;
  pageOption: string = '500';

  constructor(
    private authservice: AuthService,
    private service: UserService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.agridRequest = {
      length: 500,
      searchColumn: '',
      searchValue: '',
      pageNumber: 0,
      accessLevel: '',
      accessValue: 0,
    };
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.columnDefs = [
      {
        field: 'name',
      },
      {
        field: 'createdDate',
        cellRenderer: (params) => {
          return this.datePipe.transform(params.value, 'dd-MM-yyyy HH:mm:ss');
        },
      },
      { field: 'email' },
      { field: 'mobileNo' },
      { field: 'isEmailSend' },
      { field: 'isSmsSend' },
      { field: 'meterSerialNo' },
      {
        headerName: 'View Ticket',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.viewTicket.bind(this),
          label: 'View Ticket',
          color: 'blue',
        },
      },
    ];

    this.datas = {
      firstlevel: 'User',
      levelurl: '',
      menuname: 'Email Logs',
      url: this.router.url,
    };
  }

  ngOnInit(): void {}
  onBtnExport() {
    var excelParams = {
      fileName: 'EmailSmsLogs.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }
  viewTicket(e) {
    let deviceID = e.rowData.customerNo;
    this.router.navigate(['mdm/consumer/ConsumerDetails', deviceID]);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service.GetAllEmailAndSms(this.agridRequest).subscribe(
      (res: any) => {
        if (res.success) {
          this.dataList = res.data;
          this.gridApi.setRowData(this.dataList);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      }
    );
  }

  getRecordNumber() {
    if (this.pageOption == 'All') this.agridRequest.length = -1;
    else if (this.pageOption != 'Customize')
      this.agridRequest.length = parseInt(this.pageOption);
    if (this.pageOption != 'Customize') this.renderTable();
  }

  renderTable() {
    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service.GetAllEmailAndSms(this.agridRequest).subscribe(
      (res: any) => {
        if (res.success) {
          this.dataList = res.data;
          this.gridApi.setRowData(this.dataList);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      }
    );
  }
}
