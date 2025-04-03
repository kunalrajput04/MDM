import { Component, OnInit } from '@angular/core';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-login-logs',
  templateUrl: './login-logs.component.html',
  styleUrls: ['./login-logs.component.css']
})
export class LoginLogsComponent implements OnInit {

  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Dashboard',
    url: '/mdm/assets/',
  };


  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;

  constructor(private authservice: AuthService) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = { resizable: true, filter: true, sortable: true }
    this.columnDefs = [
      { field: 'logDateTime' },
      { field: 'logType' },
      { field: 'userName' },
      { field: 'fullName' },
    ];

    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'LoginLogs.csv'
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    params.api.showLoadingOverlay();
    this.authservice.getLoginLogs().subscribe((res: any) => {
      params.api.setRowData(res.data);
      this.gridColumnApi.autoSizeAllColumns();
    }, (err) => {
      params.api.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
    });
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }


}
