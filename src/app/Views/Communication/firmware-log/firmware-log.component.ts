import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';


@Component({
  selector: 'app-firmware-log',
  templateUrl: './firmware-log.component.html',
  styleUrls: ['./firmware-log.component.css']
})
export class FirmwareLogComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'Firmware Log',
    url: '/mdm/communication/firmwarelog',
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

  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [

      { field: 'trackingID' },
      { field: 'meterSNo' },
      { field: 'firmwareFile' },
      { field: 'mdasDateTime' },
      { field: 'commandCompletionDateTime' },
      { field: 'status' },
      { field: 'attempts' },

    ];

  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.formdata.todate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    this.formdata.meterNo = '';

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
      .getFirmwareLogs(this.formdata.fromdate, this.formdata.todate)
      .subscribe((res: any) => {
      
          if (res.data != null) {

            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  trackingID: res.data[0][item][0],
                  meterSNo: res.data[0][item][1],
                  firmwareFile: res.data[0][item][2],
                  mdasDateTime: res.data[0][item][3],
                  commandCompletionDateTime: res.data[0][item][4],
                  status: res.data[0][item][5],
                  attempts: res.data[0][item][6],
                });
              }
            }
            
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
            this.gridApi.setRowData([]);
       
      });

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
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }


}
