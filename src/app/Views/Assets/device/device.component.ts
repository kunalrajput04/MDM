import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DeviceInfoList } from 'src/app/Model/device-information';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
})
export class DeviceComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Device',
    url: '/mdm/assets/',
  };

  //#endregion
  totoalDeviceCount: number = 0;
  tableData: DeviceInfoList[] = [];
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  gridOptions: any;
  defaultColDef: any;
  meterNo: string = '';
  constructor(
    private service: DataService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private toaster: ToastrService
  ) {
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };

    this.columnDefs = [
      { field: 'consumerName' },
      { field: 'deviceSerialNo' },
      { field: 'consumerNo' },
      { field: 'installationDate' },
      { field: 'meterMode' },
      { field: 'meterType' },
      { field: 'network' },
      { field: 'nicMsisdnNo' },
      { field: 'ipAddressMain' },
      { field: 'subDivisionName' },
      { field: 'subStationName' },
      { field: 'feederName' },
      { field: 'dtName' },
      { field: 'latitude' },
      { field: 'longitude' },
    ];

    this.authservice.chagneHeaderNav(this.datas);
  }
  ngOnInit(): void {}

  onBtnExport() {
    var excelParams = {
      fileName: 'Devices.csv',
      processCellCallback: function (cell) {
        if (cell.column.colId == 'nicMsisdnNo') return '\u200C' + cell.value;
        else return cell.value;
      },
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
    this.service.getDeviceList(this.meterNo).subscribe(
      (res: any) => {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                consumerName: res.data[0][item][0],
                deviceSerialNo: res.data[0][item][1],
                consumerNo: res.data[0][item][2],
                installationDate: res.data[0][item][3],
                meterMode: res.data[0][item][4],
                meterType: res.data[0][item][5],
                network: res.data[0][item][6],
                nicMsisdnNo: res.data[0][item][7],
                ipAddressMain: res.data[0][item][8],
                subDivisionName: res.data[0][item][9],
                subStationName: res.data[0][item][10],
                feederName: res.data[0][item][11],
                dtName: res.data[0][item][12],
                latitude: res.data[0][item][13],
                longitude: res.data[0][item][14],
              });
            }
          }

          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        } else {
          this.gridApi.setRowData([]);
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
        this.toaster.error('something went wrong please try again !!!');
      }
    );
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
