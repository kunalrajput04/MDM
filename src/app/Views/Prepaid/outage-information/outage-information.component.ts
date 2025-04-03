import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OutageInformation } from 'src/app/Model/outage-information';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { SupportService } from 'src/app/Service/support.service';

@Component({
  selector: 'app-outage-information',
  templateUrl: './outage-information.component.html',
  styleUrls: ['./outage-information.component.css'],
})
export class OutageInformationComponent implements OnInit {
  substatioDropDown: any[] = [];
  formData: OutageInformation = {
    areaName: '',
    fromDate: '',
    outageID: 0,
    reason: '',
    toDate: '',
    subdivisonName: '',
  };

  consumerno: string[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;
  subdivisionDropDown: any[] = [];

  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  dataList: any = [];
  constructor(
    private substation: SubstationService,
    private subdivisionservice: SubdivisionService,
    private support: SupportService,
    private datePipe: DatePipe,
    private toaster: ToastrService
  ) {
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.columnDefs = [
      {
        field: 'areaName',
      },
      {
        field: 'fromDate',
        cellRenderer: (params) => {
          return this.datePipe.transform(params.value, 'dd-MM-yyyy');
        },
      },
      {
        field: 'toDate',
        cellRenderer: (params) => {
          return this.datePipe.transform(params.value, 'dd-MM-yyyy');
        },
      },
      {
        field: 'created',
        headerName: 'Created Date',
        cellRenderer: (params) => {
          return this.datePipe.transform(params.value, 'dd-MM-yyyy HH:mm:ss');
        },
      },

      { field: 'reason' },
      { field: 'fullName', headerName: 'Created By' },
    ];
  }

  ngOnInit(): void {
    this.getSubdivision();
  }

  getSubdivision() {
    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
      this.subdivisionDropDown = [];
      let obj = res.data[0];
      for (var item in obj) {
        this.subdivisionDropDown.push(obj[item][0]);
      }
    });
  }

  manageOutageInfo() {
    this.support.manageOutageInfo(this.formData).subscribe((res: any) => {
      if (res.success) {
        this.formData = {
          areaName: '',
          fromDate: '',
          outageID: 0,
          reason: '',
          toDate: '',
          subdivisonName: '',
        };
        this.toaster.success(res.message);
      }
    });
    this.renderTable();
  }
  getSubstation(subdivision: string) {
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        this.substatioDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.substatioDropDown.push(obj[item][0]);
        }
      });
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'OutageInformation.csv',
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
    this.renderTable();
  }
  renderTable() {
    this.dataList = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.support.getOutageInfo().subscribe(
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
