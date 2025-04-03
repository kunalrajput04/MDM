import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/Service/master.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgridRequest } from 'src/app/Model/DataTablesResponse1';
declare const $: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-master-simdata',
  templateUrl: './master-simdata.component.html',
  styleUrls: ['./master-simdata.component.css']
})
export class MasterSimdataComponent implements OnInit {
    fileUrl: string = '';
    excelfile: any;
    simStatusexcelfile: any;
    simdatas: any[] = [];
  
    tableData: any[] = [];
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
      private service: MasterService,
      private router: Router,
      private toaster: ToastrService,
      private spinner: NgxSpinnerService,
  
    ) {
      this.agridRequest = {
        length: 500,
        searchColumn: '',
        searchValue: '',
        pageNumber: 0
      }
      this.gridOptions = { context: { componentParent: this } }
      this.defaultColDef = {
        resizable: true, filter: false, sortable: true
      };
      this.columnDefs = [
        {
          field: 'msisdn',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
        { field: 'iccid' },
        { field: 'imsino' },
        { field: 'ipV6' },
        { field: 'gcode' },
        { field: 'apn' },
        { field: 'meterSerialNo' },
        { field: 'gprsSealNo' },
        { field: 'meterSealNo' },
        { field: 'boxSealNo' },
        { field: 'simStatus' }
  
      ];
  
    }
  
    ngOnInit(): void {
      this.fileUrl = environment.masterimageUrl;
    }
  
  
    onBtnExport() {
      var excelParams = {
        fileName: 'SimData.csv',
        processCellCallback: function (cell) {
          if (cell.column.colId == 'simImei' || cell.column.colId == 'msisdn' || cell.column.colId == 'imsino' || cell.column.colId == 'iccid')
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
      this.service.GetSimDataRender(this.agridRequest).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data != null) {
          this.tableData = res.data.item1;
          this.agridRequest.pageNumber=res.data.item2;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      });
    }
    renderTable() {
      this.tableData = [];
      this.gridApi.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
      this.gridApi.showLoadingOverlay();
      this.service.GetSimDataRender(this.agridRequest).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data != null) {
          this.tableData = res.data.item1;
          this.agridRequest.pageNumber=res.data.item2;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      });
  
    }
    getRecordNumber() {
      this.agridRequest.pageNumber=0;
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
  
    nextRecords() {
      this.agridRequest.pageNumber = this.agridRequest.pageNumber + 1;
      this.renderTable();
    }
  
    prevRecords() {
      this.agridRequest.pageNumber = this.agridRequest.pageNumber - 1;
      this.renderTable();
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
  
  
    //#region  Pdf
  
    // On file Select
    onChange(data: any) {
      let file = data.target.files;
      this.excelfile = file.item(0);
    }
    onChangeSimStatus(data: any) {
      let file = data.target.files;
      this.simStatusexcelfile = file.item(0);
    }
  
    postFile() {
      $('#exampleModal').modal('hide');
      this.spinner.show();
      this.service.ExcelUpload(this.excelfile).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            $('#exampleModal').modal('hide');
            // $('#syncnow').show();
            this.spinner.hide();
            this.renderTable();
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
    postSimSatatusFile() {
      $('#exampleModal1').modal('hide');
      this.spinner.show();
      this.service.SimStatusExcelUpload(this.simStatusexcelfile).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            this.spinner.hide();
            this.renderTable();
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
  
  
    //#endregion
  
    getSelectedRowData(password: string) {
  
      let selectedNodes = this.gridApi.getSelectedNodes();
      let selectedData = selectedNodes.map(node => node.data.simID);
      let data = {
        id: selectedData,
        password: password
      }
      this.service.DeleteSimData(data).subscribe((res: any) => {
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
