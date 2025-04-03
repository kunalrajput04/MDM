import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';


@Component({
  selector: 'app-non-communicating',
  templateUrl: './non-communicating.component.html',
  styleUrls: ['./non-communicating.component.css']
})
export class NonCommunicatingComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'Exception Meter',
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

  constructor(
    private service: DataService,
    private router: Router,
    private authservice: AuthService,
    private datePipe: DatePipe

  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'ConsumerNo' },
      { field: 'NICMSISDNNo' },
      { field: 'NICIPV6' },
      { field: 'LastUpdateTime' },
      { field: 'longitude' },
      { field: 'latitude' },
    ];

  }

  ngOnInit(): void {
    this.formdata.fromdate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'ExceptionLog.csv',
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.onSubmit();
  }


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  


  onSubmit() {

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service
      .getDashboardChartList(this.formdata.fromdate)
      .subscribe((res: any) => {
       
          
          if (res.data != null) {

            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  ConsumerNo: res.data[0][item][1],
                  NICMSISDNNo: res.data[0][item][2],
                  NICIPV6: res.data[0][item][3],
                  LastUpdateTime: res.data[0][item][4],
                  longitude: res.data[0][item][5],
                  latitude: res.data[0][item][6],
                });
              }
            }
            
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
            this.gridApi.setRowData([]);
      
      });
  }


}
