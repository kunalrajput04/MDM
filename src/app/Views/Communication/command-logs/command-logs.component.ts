import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RowNode } from 'ag-grid-community';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';

var ageType = 'Select Command Type';
@Component({
  selector: 'app-command-logs',
  templateUrl: './command-logs.component.html',
  styleUrls: ['./command-logs.component.css'],
})
export class CommandLogsComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'Command Log',
    url: 'mdm/communication/commandlog',
  };

  formdata: MeterData = new MeterData();

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  commandList: string[] = [];

  meterNo: string = '';

  constructor(
    private service: DataService,

    private datePipe: DatePipe,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
      floatingFilter: false,
    };

    this.columnDefs = [
      { field: 'trackingID' },
      { field: 'meterSNo' },
      {
        field: 'commandName',
      },
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
      fileName: 'CommandLogs.csv',
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

  doesExternalFilterPass(node: RowNode): boolean {
    return node.data.commandName == ageType;
  }

  isExternalFilterPresent(): boolean {
    return ageType !== 'Select Command Type';
  }

  externalFilterChanged(event: any) {
    let newValue = event.target.value;
    ageType = newValue;
    this.gridApi.onFilterChanged();
  }

  onSubmit() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.commandList = [];
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );

    this.service
      .getCommandLogData(
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
                meterSNo: res.data[0][item][1],
                commandName: res.data[0][item][2],
                mdasDateTime: res.data[0][item][3],
                commandCompletionDateTime: res.data[0][item][4],
                status: res.data[0][item][5],
                attempts: res.data[0][item][6],
              });
            }
          }

          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
          this.commandList = this.tableData
            .map((e) => e['commandName'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter((obj) => this.tableData[obj])
            .map((e) => this.tableData[e].commandName);
        } else this.gridApi.setRowData([]);
      });
  }
}
