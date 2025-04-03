import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';

@Component({
  selector: 'app-on-demand-log',
  templateUrl: './on-demand-log.component.html',
  styleUrls: ['./on-demand-log.component.css'],
})
export class OnDemandLogComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'On-Demand Log',
    url: '/mdm/meterdata/ondemandlog',
  };

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  formdata: MeterData = new MeterData();
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
      { field: 'meterSNo' },
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

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

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
        } else this.gridApi.setRowData([]);
      });
  }
}
