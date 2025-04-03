import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RowNode } from 'ag-grid-community';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

var ageType = 'Select Event Type';
@Component({
  selector: 'app-event-data',
  templateUrl: './event-data.component.html',
  styleUrls: ['./event-data.component.css'],
})
export class EventDataComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'Event Data',
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
  commandList: string[] = [];
  constructor(
    private service: DataService,

    private datePipe: DatePipe,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'mdasDateTime' },
      { field: 'eventDateTime' },
      { field: 'eventCategory' },
      { field: 'eventCode' },
      { field: 'eventType' },
      { field: 'current' },
      { field: 'voltage' },
      { field: 'pf' },
      { field: 'energyKwh' },
      { field: 'tamperCount' }


    ];
  }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 3);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'EventData.csv',
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


  doesExternalFilterPass(node: RowNode): boolean {
    return node.data.eventType == ageType;
  }

  isExternalFilterPresent(): boolean {
    return ageType !== 'Select Event Type';
  }


  externalFilterChanged(event: any) {
    let newValue = event.target.value;
    ageType = newValue;
    this.gridApi.onFilterChanged();
  }


  onSubmit() {
    this.commandList = [];
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

    this.service.getEventData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo).subscribe((res: any) => {
    
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                meterSNo: res.data[0][item][0],
                mdasDateTime: res.data[0][item][1],
                eventDateTime: res.data[0][item][2],
                eventCategory: res.data[0][item][3],
                eventCode: res.data[0][item][4],
                eventType: res.data[0][item][5],
                current: res.data[0][item][6],
                voltage: res.data[0][item][7],
                pf: res.data[0][item][8],
                energyKwh: res.data[0][item][9],
                tamperCount: res.data[0][item][10],
              });
            }
          }
          
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
          this.commandList = this.tableData
            .map(e => e['eventType'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(obj => this.tableData[obj])
            .map(e => this.tableData[e].eventType);
        }
        else
          this.gridApi.setRowData([]);
      
    });

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

}
