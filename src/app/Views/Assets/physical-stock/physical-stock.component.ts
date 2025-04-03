import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IFaultyMeter } from 'src/app/Model/ifaulty-meter';
import {
  MeterCount,
  PhysicalStock,
  PhysicalStockList,
  StockFilter,
} from 'src/app/Model/meter-inventory';
import { AssetsService } from 'src/app/Service/assets.service';
import { AuthService } from 'src/app/Service/auth.service';
import { ButtonRendererComponent } from 'src/app/Shared/button-renderer/button-renderer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-physical-stock',
  templateUrl: './physical-stock.component.html',
  styleUrls: ['./physical-stock.component.css'],
})
export class PhysicalStockComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Stock',
    url: '/mdm/assets/',
  };

  //#endregion

  meterCountData: MeterCount = {
    faultyMeter: 0,
    installed: 0,
    totalAirtel: 0,
    totalAvilable: 0,
    totalJio: 0,
  };
  formData: StockFilter = {
    meterManufacture: '',
    meterStatus: '',
    meterType: '',
    simType: '',
  };
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  dataList: IFaultyMeter[] = [];

  gridColumnApiStock: any;
  columnDefsStock: any;
  gridApiStock: any;
  stockList: PhysicalStockList[] = [];
  frameworkComponents: any;
  constructor(
    private service: AssetsService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private datePipe: DatePipe
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      {
        field: 'isInstalled',
        cellRenderer: (params) => {
          if (params.value) return 'Installed';
          else return 'Not-Installed';
        },
        cellClass: (params) => {
          return params.value === true ? 'installedspan' : 'notspan';
        },
      },
      { field: 'meterManufacture' },
      { field: 'msisdn' },
      { field: 'iccid' },
      { field: 'imsino' },
      { field: 'ipV6' },
      { field: 'gcode', headerName: 'Network Type' },
      { field: 'apn' },
      { field: 'meterSerialNo' },

      {
        field: 'created',
        cellRenderer: (params) => {
          return this.datePipe.transform(params.value, 'dd-MM-yyyy');
        },
      },
    ];
    this.columnDefsStock = [
      {
        headerName: 'Action',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onBtnClick1.bind(this),
          label: 'View',
          color: 'blue',
          isModal: true,
        },
      },
      { field: 'meterType' },
      { field: 'meterManufacture' },
      { field: 'faultyCount' },
      { field: 'okCount' },
      { field: 'totalCount' },
    ];
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit(): void {
    this.meterCount();
  }

  meterCount() {
    this.service.meterCount().subscribe((res: any) => {
      if (res.success == true) {
        this.meterCountData = res.data;
      } else {
        this.toastr.error(res.message);
      }
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      };
    });
  }

  onBtnClick1(e) {
    let meterManufacture = e.rowData.meterManufacture;
    let meterType = e.rowData.meterType;
    this.getMeterLists(meterManufacture, meterType);
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'FaultyMeters.csv',
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

  onGridReadyStock(params: any) {
    this.gridApiStock = params.api;
    this.gridColumnApiStock = params.columnApi;
    this.gridApiStock.setRowData([]);
    this.gridColumnApiStock.autoSizeAllColumns();
    this.onListStock();
  }

  onListStock() {
    this.stockList = [];
    this.gridApiStock.setRowData([]);
    this.gridColumnApiStock.autoSizeAllColumns();

    this.gridApiStock.showLoadingOverlay();
    this.service.stockCountMeterList(this.formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.stockList = res.data;
          this.gridApiStock.setRowData(this.stockList);
          this.gridColumnApiStock.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApiStock.setRowData([]);
        this.gridColumnApiStock.autoSizeAllColumns();
      }
    );
  }

  getMeterLists(meterManufacture: string, meterType: string) {
    this.formData.meterType = meterType;
    this.formData.meterManufacture = meterManufacture;
    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service.stockMeterList(this.formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.dataList = res.data;
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

  getMeterListsByCard(meterManufacture: string) {
    let data = {
      meterManufacture: meterManufacture,
    };
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();

    this.dataList = [];
    this.gridApi.showLoadingOverlay();
    this.service.meterListByCard(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.dataList = res.data;
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
