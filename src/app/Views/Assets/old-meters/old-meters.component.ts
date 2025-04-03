import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgridRequest } from 'src/app/Model/DataTablesResponse';
import { MeterService } from 'src/app/Service/meter.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-old-meters',
  templateUrl: './old-meters.component.html',
  styleUrls: ['./old-meters.component.css'],
})
export class OldMetersComponent implements OnInit {
  tableData: any[] = [];

  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  gridOptions: any;
  enableCellTextSelection: boolean = true;
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
        field: 'customerNumber',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      { field: 'customerName' },
      { field: 'address' },
      { field: 'oldMeterSerialNumber' },
      { field: 'meterManufacture' },
      { field: 'lastBillingReading' },
      { field: 'meterStatus' },
      { field: 'meterType' },
      { field: 'mobileNo' },
      { field: 'monthlyBilled' },
      { field: 'sectionLoad' },
      { field: 'installationDate' },
      { field: 'installationBy' },
    ];
  }

  ngOnInit(): void {}

  onBtnExport() {
    var excelParams = {
      fileName: 'OldMeters.csv',
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
      .getAllOldMeterRender(this.agridRequest)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.tableData = res.data;
          params.api.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
      });
  }

  onSubmit() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();

    this.service.getAllOldMeterRender(this.agridRequest).subscribe(
      (res: any) => {
        if (res.data != null) {
          this.tableData = res.data;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      }
    );
  }
  getRecordNumber() {
    if (this.pageOption == 'All') this.agridRequest.length = -1;
    else if (this.pageOption != 'Customize')
      this.agridRequest.length = parseInt(this.pageOption);
    if (this.pageOption != 'Customize') this.onSubmit();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

 
 
}
