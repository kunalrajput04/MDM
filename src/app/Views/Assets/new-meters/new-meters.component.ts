import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgridRequest } from 'src/app/Model/DataTablesResponse';
import { MeterService } from 'src/app/Service/meter.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-meters',
  templateUrl: './new-meters.component.html',
  styleUrls: ['./new-meters.component.css'],
})
export class NewMetersComponent implements OnInit {
  tableData: any[] = [];
  fileUrl: string = environment.imageUrl;
  excelfile: any;
  excelfile1: any;
  newMeterID: number[] = [];

  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  gridOptions: any;
  enableCellTextSelection: boolean = true;
  defaultColDef: any;
  pageOption: string = '500';
  rowSelection = 'multiple';
  agridRequest: AgridRequest;
  constructor(
    private service: MeterService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.agridRequest = {
      length: 500,
      searchColumn: '',
      searchValue: '',
      pageNumber: 0,
      accessLevel: '',
      accessValue: 0,
    };
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.columnDefs = [
      {
        field: 'customerNo',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      { field: 'newCustomerNo' },
      { field: 'customerName' },
      { field: 'customerAddress' },
      { field: 'subdivisionID' },
      { field: 'substationID' },
      { field: 'feederID' },
      { field: 'dtid' },
      { field: 'meterNo' },
      { field: 'oldMeterSerialNumber' },
      { field: 'simImei' },
      { field: 'iPv6Address' },
      { field: 'simType' },
      { field: 'meterSealNo' },
      { field: 'boxSealNo' },
      { field: 'gprsSealNo' },
      { field: 'meterManufacture' },
      { field: 'sectionLoad' },
      { field: 'installedKWH' },
      { field: 'mobileNo' },
      { field: 'meterType' },
      { field: 'simStatus' },
      { field: 'installationDate' },
      { field: 'installationBy' },
      { field: 'aadharNo' },
      { field: 'bookNo' },
      { field: 'houseno' },
      { field: 'villageName' },
      
    ];
  }
  ngOnInit(): void {}

  onBtnExport() {
    var excelParams = {
      fileName: 'MeterSummary.csv',
      processCellCallback: function (cell) {
        if (cell.column.colId == 'simImei' || cell.column.colId == 'aadharNo')
          return '\u200C' + cell.value;
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
    params.api.showLoadingOverlay();
    this.service
      .getAllNewMeterRender(this.agridRequest)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.tableData = res.data;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
      });
  }
  renderTable() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service
      .getAllNewMeterRender(this.agridRequest)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.tableData = res.data;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
      });
  }
  getRecordNumber() {
    if (this.pageOption == 'All') this.agridRequest.length = -1;
    else if (this.pageOption != 'Customize')
      this.agridRequest.length = parseInt(this.pageOption);
    if (this.pageOption != 'Customize') this.renderTable();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
