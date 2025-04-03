import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RowNode } from 'ag-grid-community';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';

var ageType = 'Select Command Type';
@Component({
  selector: 'app-configuration-report',
  templateUrl: './configuration-report.component.html',
  styleUrls: ['./configuration-report.component.css']
})
export class ConfigurationReportComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Communication',
    levelurl: '',
    menuname: 'Configuration Report',
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
  commandList: string[] = [];
  constructor(
    private service: DataService,
    private authservice: AuthService,
    private datePipe: DatePipe,


  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'trackingID' },
      { field: 'meterSNo' },
      { field: 'commandName' },
      { field: 'mdasDateTime' },
      { field: 'commandCompletionDateTime' },
      { field: 'status' },
      { field: 'attempts' },



    ];

  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

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
    this.onList();
  }
  onList() {
    this.commandList = [];
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service.getConfigrationReportData(this.formdata.fromdate, this.formdata.todate).subscribe((res: any) => {
     
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.tableData.push({
              trackingID: res.data[0][item][0],
              meterSNo: res.data[0][item][1],
              commandName: res.data[0][item][2],
              mdasDateTime: res.data[0][item][3],
              commandCompletionDateTime: res.data[0][item][4],
              status: res.data[0][item][5],
              attempts: res.data[0][item][6]
            });
          }
        }
        
        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();
        this.commandList = this.tableData
          .map(e => e['commandName'])
          .map((e, i, final) => final.indexOf(e) === i && i)
          .filter(obj => this.tableData[obj])
          .map(e => this.tableData[e].commandName);
     
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }


  doesExternalFilterPass(node: RowNode): boolean {
    return node.data.commandName == ageType;
  }

  isExternalFilterPresent(): boolean {
    return ageType !== 'Select Command Type';
  }


  externalFilterChanged(event: any) {
    
    let newValue = event.target.value;
    ageType = newValue;
    this.gridApi.onFilterChanged();
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
    this.onList();
  }



}
