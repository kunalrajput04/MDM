import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData, MeterDatas } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-sms-log',
  templateUrl: './sms-log.component.html',
  styleUrls: ['./sms-log.component.css']
})
export class SmsLogComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'SMS Log',
    url: '/mdm/communication/smslog',
  };

  //#endregion

  formdata: MeterData = new MeterData();


  consumerno: any[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  tableData: any[] = [];

  constructor(
    private service: DataService,

    private datePipe: DatePipe,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'ACCOUNT_NO' },
      { field: 'CONSUMER_NAME' },
      { field: 'CONSUMER_MOBILE_NO' },
      { field: 'CONSUMER_EMAIL_ID' },
      { field: 'ALERT_MESSAGE' },
      { field: 'ALERT_SEND_DATETIME' },
    ];

  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.formdata.todate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.formdata.meterNo = '';

  }

  getInstant() {



    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();


    this.service
      .getSMSLog(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo)
      .subscribe((res: any) => {

        if (
         res.success==true
        ) {

          this.tableData = res.data.CONSUMER_ALERT;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        } else {
          this.gridApi.setRowData([]);

          this.gridColumnApi.autoSizeAllColumns();
        }
      },
        (err) => {
          this.gridApi.setRowData([]);
          this.gridColumnApi.autoSizeAllColumns();
        });

  }
  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'dd-MMM-yyyy'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'dd-MMM-yyyy'
    );

    this.getInstant();
  }

  getConsumers(data: any) {

    let consumernumber = data.target.value;
    if (consumernumber.length > 3) {
      this.loading = true;
      this.storeservice.getConsumerWithMeterNo(consumernumber).subscribe(
        (res: any) => {

          this.consumerno = res.data;
          this.loading = false;
        },
        (err) => {

        }
      );
    }
  }

  onBtnExport() {

    var excelParams = {
      fileName: 'SMSLog.csv',
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
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.getInstant();
  }

}
