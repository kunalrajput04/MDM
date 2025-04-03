import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccessLevelData } from 'src/app/Model/access-level';
import { ActivityLogs } from 'src/app/Model/activity-logs';
import { AgridRequest } from 'src/app/Model/DataTablesResponse';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { HESEvents } from 'src/app/Model/hesevents';
import { Dropdown } from 'src/app/Model/smart-meter';
import { AuthService } from 'src/app/Service/auth.service';
import { ExceptionServiceService } from 'src/app/Service/exception-service.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css']
})
export class ActivityLogsComponent implements OnInit {

  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'User',
    levelurl: '',
    menuname: 'Activity Logs',
    url: '/mdm/user/activitylogs',
  };

  //#endregion
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  rowSelection = 'multiple';
  agridRequest: AgridRequest;
  pageOption: string = '500';
  dataList: ActivityLogs[] = [];
  constructor(
    private service: AuthService,
    private datePipe: DatePipe,

  ) {
    this.service.chagneHeaderNav(this.datas);
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
        field: 'moduleName'
       
      },
      {
        field: 'actionName'
        
      },
      {
        field: 'createdBy',
        headerName:'Activity By'
        
      },
      {
        field: 'createdDate',
        headerName:'Activity Date',
        cellRenderer: (params) => {
          return this.datePipe.transform(params.value, 'dd-MM-yyyy HH:mm:ss');
        },
      },
      { field: 'roleName' },
    
    ];
  }

  ngOnInit(): void {
    
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'ActivityLogs.csv',
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
    this.service.getActivityLogs(this.agridRequest).subscribe(
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
    this.service.getActivityLogs(this.agridRequest).subscribe(
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
