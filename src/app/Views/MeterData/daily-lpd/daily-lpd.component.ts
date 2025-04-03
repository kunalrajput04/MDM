import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';


@Component({
  selector: 'app-daily-lpd',
  templateUrl: './daily-lpd.component.html',
  styleUrls: ['./daily-lpd.component.css'],
})
export class DailyLpdComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'Daily Data',
    url: '/mdm/meterdata/',
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
      { field: 'meterSNo' },
      { field: 'dateTime' },
      { field: 'mdasDateTime' },
      { field: 'energyImportKwh' },
      { field: 'energyImportKvah' },
      { field: 'energyExportKwh' },
      { field: 'energyExportKvah' }


    ];
  }

  ngOnInit(): void {


    let date = new Date();
    date.setDate(date.getDate() - 6);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');


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
      fileName: 'DailyLpd.csv',
    }
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
    
    this.service.getDailyLoadProfileData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo)
      .subscribe((res: any) => {
     
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  dateTime: res.data[0][item][1],
                  mdasDateTime: res.data[0][item][2],
                  energyImportKwh: res.data[0][item][3],
                  energyImportKvah: res.data[0][item][4],
                  energyExportKwh: res.data[0][item][5],
                  energyExportKvah: res.data[0][item][6],

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
