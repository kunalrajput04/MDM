import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { INewMeter } from 'src/app/Model/inew-meter';
import { AssetsService } from 'src/app/Service/assets.service';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-installed-meters',
  templateUrl: './installed-meters.component.html',
  styleUrls: ['./installed-meters.component.css'],
})
export class InstalledMetersComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Faulty/Damage Meter',
    url: '/mdm/assets/',
  };

  //#endregion
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  dataList: INewMeter[] = [];
  fromDate: string = '';
  toDate: string = '';
  singlePhase: number = 0;
  threePhase: number = 0;
  ctMeters: number = 0;
  htMeters: number = 0;
  jio: number = 0;
  airtel: number = 0;

  constructor(
    private service: AssetsService,
    private datePipe: DatePipe,
    private authservice: AuthService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      { field: 'customerNo' },
      { field: 'newCustomerNo' },
      { field: 'customerName' },
      { field: 'customerAddress' },
      { field: 'installationDate' },
      { field: 'meterManufacture' },
      { field: 'simType' },
      { field: 'simImei' },
      { field: 'meterType' },
      { field: 'subdivisionID' },
      { field: 'substationID' },
      { field: 'feederID' },
      { field: 'dtid' },
      { field: 'latitude' },
      { field: 'longitude' },
    ];
  }

  ngOnInit(): void {}

  onBtnExport() {
    var excelParams = {
      fileName: 'InstalledMeters_' + this.fromDate + ' .csv',
      processCellCallback: function (cell) {
        if (
          cell.column.colId == 'iccid' ||
          cell.column.colId == 'msisdn' ||
          cell.column.colId == 'imsino'
        )
          return '\u200C' + cell.value;
        else if (cell.column.colId == 'isInstalled') {
          if (cell.value) return 'Installed';
          else return 'Not-Installed';
        } else return cell.value;
      },
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
  }
  onList() {
    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service.getInstalledDevice(this.fromDate, this.toDate).subscribe(
      (res: any) => {
        if (res.success) {
          this.dataList = res.data;
          this.singlePhase = this.dataList.filter(
            (item) => item.meterType === 'Single Phase'
          ).length;
          this.threePhase = this.dataList.filter(
            (item) => item.meterType === 'Three Phase'
          ).length;
          this.ctMeters = this.dataList.filter(
            (item) => item.meterType === 'CT Meter'
          ).length;
          this.htMeters = this.dataList.filter(
            (item) => item.meterType === 'HT Meter'
          ).length;
          this.jio = this.dataList.filter(
            (item) => item.simType === 'JIO' || item.simType === 'jio'
          ).length;
          this.airtel = this.dataList.filter(
            (item) => item.simType === 'Airtel' || item.simType === 'AIRTEL'
          ).length;
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
}
