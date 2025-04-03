import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';


@Component({
  selector: 'app-name-plate',
  templateUrl: './name-plate.component.html',
  styleUrls: ['./name-plate.component.css']
})
export class NamePlateComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'Name Plate',
    url: 'mdm/communication/nameplate',
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
    private storeservice: SmartMeterService

  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'deviceSNo' },
      { field: 'mdasDateTime' },
      { field: 'meterSNo' },
      { field: 'fwVersion' },
      { field: 'currentRating' },
      { field: 'deviceID' },
      { field: 'manufacturerName' },
      { field: 'manufacturerYear' },
      { field: 'meterType' },
      { field: 'status' }

    ];

  }

  ngOnInit(): void {



  }

  onBtnExport() {
    var excelParams = {

      fileName: 'NamePlate.csv',

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

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service
      .getNamePlate(this.formdata.meterNo)
      .subscribe((res: any) => {
      
          
          if (res.data != null) {

            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  deviceSNo: res.data[0][item][0],
                  mdasDateTime: res.data[0][item][1],
                  meterSNo: res.data[0][item][2],
                  fwVersion: res.data[0][item][3],
                  currentRating: res.data[0][item][4],
                  deviceID: res.data[0][item][5],
                  manufacturerName: res.data[0][item][6],
                  manufacturerYear: res.data[0][item][7],
                  meterType: res.data[0][item][8],
                  status: res.data[0][item][9],
                });
              }
            }
            
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
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
