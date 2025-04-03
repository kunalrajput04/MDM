import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RowNode } from 'ag-grid-community';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';

@Component({
  selector: 'app-all-command-log',
  templateUrl: './all-command-log.component.html',
  styleUrls: ['./all-command-log.component.css'],
})
export class AllCommandLogComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'All Command Log',
    url: 'mdm/communication/exceptionlog',
  };

  formdata: MeterData = new MeterData();
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  consumerno: any[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;
  meterNo: string = '';
  constructor(
    private service: DataService,
    private authservice: AuthService,
    private datePipe: DatePipe
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };

    this.columnDefs = [
      { field: 'trackingID' },
      { field: 'meterNo' },
      { field: 'commandName' },
      { field: 'mdasDateTime' },
      { field: 'commandCompletionDateTime' },
      { field: 'status' },
      { field: 'attempts' },
    ];
  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'FullCommandLogs.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }
  onList() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service
      .getAllCommandLogs(
        this.formdata.fromdate,
        this.formdata.todate,
        this.meterNo
      )
      .subscribe((res: any) => {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                trackingID: res.data[0][item][0],
                meterNo: res.data[0][item][1],
                commandName: res.data[0][item][2],
                mdasDateTime: res.data[0][item][3],
                commandCompletionDateTime: res.data[0][item][4],
                status: res.data[0][item][5],
                attempts: res.data[0][item][6],
              });
            }
          }
        }

        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();
      });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
    this.onList();
  }
}
