import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccessLevelData } from 'src/app/Model/access-level';
import { AgridRequest } from 'src/app/Model/DataTablesResponse';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { HESEvents } from 'src/app/Model/hesevents';
import { Dropdown } from 'src/app/Model/smart-meter';
import { AuthService } from 'src/app/Service/auth.service';
import { ExceptionServiceService } from 'src/app/Service/exception-service.service';

@Component({
  selector: 'app-critical-events-log',
  templateUrl: './critical-events-log.component.html',
  styleUrls: ['./critical-events-log.component.css'],
})
export class CriticalEventsLogComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Exception',
    levelurl: '',
    menuname: 'Critical Events',
    url: '/mdm/assets/critical',
  };

  //#endregion
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  dataList: HESEvents[] = [];
  rowSelection = 'multiple';

  agridRequest: AgridRequest;
  pageOption: string = '500';
  subDivDropDown: Dropdown[];
  subDropDown: Dropdown[];
  feedDropDown: Dropdown[];
  dtDropDown: Dropdown[];
  accessLevel: string =
    localStorage.getItem('AccessLevel') == 'ALL'
      ? 'All'
      : localStorage.getItem('AccessLevel');
  selectedLevel: string = this.accessLevel;
  formData: AccessLevelData = {
    dtID: 0,
    feederID: 0,
    subdivisonID: 0,
    substationID: 0,
  };
  constructor(
    private authservice: AuthService,
    private service: ExceptionServiceService,
    private datePipe: DatePipe
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
        field: 'meterSerialNo',
      },
      {
        field: 'eventDateTime',
      },

      { field: 'eventCategory' },
      { field: 'eventCode' },
      { field: 'eventType' },
    ];
  }

  ngOnInit(): void {
    this.getAccessLevel('Subdivision', 0);
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'NewEvents.csv',
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
    this.service.GetCriticalEvents(this.agridRequest).subscribe(
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
    if (this.selectedLevel == 'All') {
      this.agridRequest.accessLevel = this.selectedLevel;
      this.agridRequest.accessValue = 0;
    } else if (this.selectedLevel == 'SUBDEVISION') {
      this.agridRequest.accessLevel = this.selectedLevel;
      this.agridRequest.accessValue = this.formData.subdivisonID;
    } else if (this.selectedLevel == 'SUBSTATION') {
      this.agridRequest.accessLevel = this.selectedLevel;
      this.agridRequest.accessValue = this.formData.substationID;
    } else if (this.selectedLevel == 'FEEDER') {
      this.agridRequest.accessLevel = this.selectedLevel;
      this.agridRequest.accessValue = this.formData.feederID;
    } else if (this.selectedLevel == 'DT') {
      this.agridRequest.accessLevel = this.selectedLevel;
      this.agridRequest.accessValue = this.formData.dtID;
    }

    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service.GetCriticalEvents(this.agridRequest).subscribe(
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

  getAccessLevel(accessLevel: string, iD: number) {
    this.service
      .getAccessLevelDropdown(accessLevel, iD)
      .subscribe((res: any) => {
        if (res.success) {
          if (accessLevel == 'Subdivision') this.subDivDropDown = res.data;
          else if (accessLevel == 'Substation') this.subDropDown = res.data;
          else if (accessLevel == 'Feeder') this.feedDropDown = res.data;
          else if (accessLevel == 'Dt') this.dtDropDown = res.data;
        }
      });
  }
}
