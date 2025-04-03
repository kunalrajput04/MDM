import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/Service/master.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { AgridRequest } from 'src/app/Model/DataTablesResponse1';
import Swal from 'sweetalert2';
declare const $: any;
@Component({
  selector: 'app-master-customer-data',
  templateUrl: './master-customer-data.component.html',
  styleUrls: ['./master-customer-data.component.css']
})
export class MasterCustomerDataComponent implements OnInit {
    fileUrl: string = '';
    excelfile: any;
    excelfile1: any;
    tableData: any;
  
    isDataAvilable: boolean = false;
  
  
    gridApi: any;
    gridColumnApi: any;
    columnDefs: any;
    gridOptions: any;
    enableCellTextSelection: boolean = true;
    defaultColDef: any;
    pageOption: string = '500';
    agridRequest: AgridRequest;
    rowSelection = 'multiple';
  
    constructor(
      private service: MasterService,
      private router: Router,
      private toaster: ToastrService,
      private spinner: NgxSpinnerService,
      private http: HttpClient
    ) {
      this.gridOptions = { context: { componentParent: this } }
      this.defaultColDef = {
        resizable: true, filter: false, sortable: true
      };
      this.columnDefs = [
        {
          field: 'customerNo',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
        { field: 'newConsumerNo' },
        { field: 'consumerName' },
        { field: 'customerAddress' },
        { field: 'isReplaceMeter' },
        { field: 'dist_Division' },
        { field: 'subDivision' },
        { field: 'subStation' },
        { field: 'feeder' },
        { field: 'dt' },
        { field: 'district' },
        { field: 'division' }
      ];
      this.agridRequest = {
        length: 500,
        searchColumn: '',
        searchValue: '',
        pageNumber:0
      }
    }
  
    ngOnInit(): void {
      this.checkCustomerDataAvilable();
      this.fileUrl = environment.masterimageUrl;
  
    }
  
  
  
    onBtnExport() {
      var excelParams = {
        fileName: 'MeterSummary.csv',
        processCellCallback: function (cell) {
          if (cell.column.colId == 'simImei' || cell.column.colId == 'aadharNo')
            return "\u200C" + cell.value;
          else
            return cell.value;
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
      this.service.GetCustomerData(this.agridRequest).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data != null) {
          this.tableData = res.data;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
        else {
          this.gridApi.setRowData();
          this.gridColumnApi.autoSizeAllColumns();
        }
      });
    }
    renderTable() {
      this.tableData = [];
      this.gridApi.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
      this.gridApi.showLoadingOverlay();
      this.service.GetCustomerData(this.agridRequest).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data != null) {
          this.tableData = res.data;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
        else {
          this.gridApi.setRowData();
          this.gridColumnApi.autoSizeAllColumns();
        }
      });
  
    }
    getRecordNumber() {
      if (this.pageOption == 'All')
        this.agridRequest.length = -1;
      else if (this.pageOption != 'Customize')
        this.agridRequest.length = parseInt(this.pageOption);
      if (this.pageOption != 'Customize')
        this.renderTable();
    }
  
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
  
  
    exportCustomerData() {
      this.spinner.show();
      this.service.ExportCustomerData().subscribe((response) => {
        this.downLoadFile(response, 'application/ms-excel');
        this.spinner.hide();
      });
    }
  
    downLoadFile(data: any, type: string) {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      });
      let url = window.URL.createObjectURL(blob);
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Please disable your Pop-up blocker and try again.');
      }
    }
  
    onChange(data: any) {
      let file = data.target.files;
      this.excelfile = file.item(0);
    }
    onChange1(data: any) {
      let file = data.target.files;
      this.excelfile1 = file.item(0);
    }
  
    postFile() {
      $('#exampleModal').modal('hide');
      this.spinner.show();
      this.service.ExcelUploadCustomerData(this.excelfile).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            $('#exampleModal').modal('hide');
            this.checkCustomerDataAvilable();
            this.renderTable();
            this.spinner.hide();
  
          } else {
            this.spinner.hide();
            this.toaster.error(res.message);
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
          this.toaster.error(err.message);
        }
      );
    }
    postFile1() {
      $('#exampleModal1').modal('hide');
      this.spinner.show();
      this.service.ExcelUploadCustomerNameAndNo(this.excelfile1).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            $('#exampleModal1').modal('hide');
            this.renderTable();
            this.spinner.hide();
  
          } else {
            this.spinner.hide();
            this.toaster.error(res.message);
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
          this.toaster.error(err.message);
        }
      );
    }
  
    checkCustomerDataAvilable() {
      this.service.CheckCustomerDataAvilable().subscribe(
        (res: any) => {
          if (res.success) {
            this.isDataAvilable = res.data;
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
          this.toaster.error(err.message);
        }
      );
    }
    SyncData() {
      this.spinner.show()
      this.service.SyncNow().subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.success) {
            this.checkCustomerDataAvilable();
            this.toaster.success(res.message);
            this.renderTable();
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
          this.toaster.error(err.message);
        }
      );
    }
  
  
    getSelectedRowData(password: string) {
  
      let selectedNodes = this.gridApi.getSelectedNodes();
      let selectedData = selectedNodes.map(node => node.data.customerID);
      let data = {
        id: selectedData,
        password: password
      }
      this.service.DeleteCustomerData(data).subscribe((res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.toaster.success(res.message);
          this.renderTable();
        }
        else
        {
          this.spinner.hide();
          this.toaster.error(res.message);
        }
      },
        (err) => {
          this.toaster.error(err.message);
  
        }
      );
    }
  
    deleteConfirmation() {
      Swal.fire({
        title: 'You will not be able to recover this data!',
        html: `<input type="text" id="otp" class="swal2-input" placeholder="Enter Password">`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        preConfirm: () => {
          let otp = $('#otp').val();
          if (!otp ) {
            Swal.showValidationMessage(`Please enter password`)
          }
          return { otp: otp }
        }
      }).then((result) => {
        let insertOtp = result.value.otp;
        this.spinner.show();
        this.getSelectedRowData(insertOtp);
  
      })
    }
  }