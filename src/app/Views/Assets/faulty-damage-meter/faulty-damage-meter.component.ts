import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IFaultyMeter } from 'src/app/Model/ifaulty-meter';
import { AssetsService } from 'src/app/Service/assets.service';
import { AuthService } from 'src/app/Service/auth.service';
declare const $: any;
@Component({
  selector: 'app-faulty-damage-meter',
  templateUrl: './faulty-damage-meter.component.html',
  styleUrls: ['./faulty-damage-meter.component.css']
})
export class FaultyDamageMeterComponent implements OnInit {
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
  dataList: IFaultyMeter[] = [];

  fileUrl: string = '';
  excelfile: any;

  @ViewChild('closebutton') closebutton;
  constructor(private service: AssetsService, private datePipe: DatePipe, private authservice: AuthService, private spinner: NgxSpinnerService, private toaster: ToastrService) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = { resizable: true, filter: true, sortable: true }
    this.columnDefs = [
      {
        field: 'isInstalled',
        cellRenderer: params => {
          if (params.value)
            return 'Installed';
          else
            return 'Not-Installed'
        },
        cellClass: params => {

          return params.value === true ? 'installedspan' : 'notspan';
        }
      },
      { field: 'meterStatus' },
      { field: 'meterManufacture' },
      { field: 'msisdn' },
      { field: 'iccid' },
      { field: 'imsino' },
      { field: 'ipV6' },
      { field: 'gcode' },
      { field: 'apn' },
      { field: 'meterSerialNo' },
      
      {
        field: 'created',
        cellRenderer: params => {

          return this.datePipe.transform(params.value, 'dd-MM-yyyy');
        }

      },
      { field: 'remarks' },

    ];

  }

  ngOnInit(): void {
  }

  onBtnExport() {

    var excelParams = {
      fileName: 'FaultyMeters.csv',
      processCellCallback: function (cell) {
        if (cell.column.colId == 'iccid' || cell.column.colId == 'msisdn' || cell.column.colId == 'imsino')
          return "\u200C" + cell.value;
        else if (cell.column.colId == 'isInstalled') {
          if (cell.value)
            return 'Installed';
          else
            return 'Not-Installed'
        }
        else
          return cell.value;
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
    this.onList();
  }
  onList() {
    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service.faultyMeterList().subscribe((res: any) => {
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

  onChange(data: any) {
    let file = data.target.files;
    this.excelfile = file.item(0);
  }


  postFile() {
    
    this.service.ExcelUpload(this.excelfile).subscribe(
      (res: any) => {
        if (res.success) {
          this.toaster.success(res.message);
          this.closebutton.nativeElement.click();
          
          this.onList();
        } else {
          
          this.toaster.error(res.message);
        }
      },
      (err) => {
        
        console.log(err);
        this.toaster.error(err.message);
      }
    );
  }
}


