import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

export interface IFilterData {
  fromdate: string;
  todate: string;
  meterNo: string;
  accessLevel: string;
  dataRange: string;
  subdivisonName: string;
  substationName: string;
  feederName: string;
  dtName: string;
}

@Component({
  selector: 'app-prepaid-consumer',
  templateUrl: './prepaid-consumer.component.html',
  styleUrls: ['./prepaid-consumer.component.css'],
})
export class PrepaidConsumerComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Prepaid Service',
    levelurl: '',
    menuname: 'Prepaid Consumer',
    url: '/mdm/PrepaidService/',
  };

  formdata: IFilterData = {
    accessLevel: 'CONSUMER',
    dataRange: 'DAILY',
    fromdate: '',
    meterNo: '',
    todate: '',
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
  };

  lables: any = [];
  deltalables: any = [];
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  levelValue: string;
  levelName: string;

  title = 'AgGrid';
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  rowData: any;
  gridOptions: any;
  defaultColDef: any;
  data: ConsumerMeterInfo[] = [];

  constructor(
    private service: PrepaidService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private toastr: ToastrService,
    private authservice: AuthService
  ) {
    this.levelValue = localStorage.getItem('AccessValue');
    this.levelName = localStorage.getItem('AccessLevel');
    this.authservice.chagneHeaderNav(this.datas);
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      {
        headerName: 'Meter S_NO',
        field: 'meterSerialNumber',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Meter Type',
        field: 'meterType',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Consumer Type',
        field: 'consumerType',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Customer  Name',
        field: 'customerName',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'IPv6 Address',
        field: 'iPv6Address',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Latitude',
        field: 'latitude',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Longitude',
        field: 'longitude',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'AadharNo',
        field: 'aadharNo',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'NewConsumerNo',
        field: 'newConsumerNo',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Billing Category',
        field: 'billingCategory',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Sim Type',
        field: 'simType',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Sim_IMEI',
        field: 'simImei',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Address',
        field: 'address',
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
    ];
  }

  ngOnInit(): void {}

  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  onBtnUpdate() {
    var eGridDiv = document.querySelector('#csvResult');
    eGridDiv = this.gridApi.getDataAsCsv();
  }

  getSubdivision() {
    this.subdivisionservice.getSubdivision().subscribe(
      (res: any) => {
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getSubstation(subdivision: string) {
    this.substation.getSubstationBySubdivision(subdivision).subscribe(
      (res: any) => {
        this.substatioDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.substatioDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getFeeder(substation: string) {
    this.feederservice.getFeederBySubstation(substation).subscribe(
      (res: any) => {
        this.feederDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.feederDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getDT(feeder: string) {
    this.dtservice.getDTByFeeder(feeder).subscribe(
      (res: any) => {
        this.dtDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  accessLevelChange() {
    if (this.formdata.accessLevel != 'CONSUMER') {
      this.getSubdivision();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.service
      .GetPrepaidconsumers(this.levelName, this.levelValue)
      .subscribe((res: any) => {
        if (res.success == true && res.data != null) {
          this.data = res.data;
          this.gridApi.setRowData(res.data);
        }
      });
  }
}
