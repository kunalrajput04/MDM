import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AgridRequests } from 'src/app/Model/DataTablesResponse';
import { NewMeterService } from 'src/app/Service/new-meter.service';
import { environment } from 'src/environments/environment';
declare const $: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-newmeter',
  templateUrl: './newmeter.component.html',
  styleUrls: ['./newmeter.component.css']
})
export class NewmeterComponent implements OnInit {
 tableData: any[] = [];
    fileUrl: string = environment.masterimageUrl;
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
    agridRequest: AgridRequests;
    constructor(
      private service: NewMeterService,
      private router: Router,
      private spinner: NgxSpinnerService,
      private toaster: ToastrService,
      private datePipe: DatePipe
    ) {
  
      this.agridRequest = {
        length: 500,
        searchColumn: '',
        searchValue: '',
        pageNumber:0
      }
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
        { field: 'newCustomerNo' },
        { field: 'customerName' },
        { field: 'aadharNo' },
        { field: 'bookNo' },
        { field: 'houseno' },
        { field: 'villageName' },
        { field: 'customerAddress' },
        { field: 'subdivisionID' },
        { field: 'substationID' },
        { field: 'feederID' },
        { field: 'dtid' },
        { field: 'meterNo' },
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
      ];
  
    }
    ngOnInit(): void {
      let latest_date = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  
    }
  
    onEditRow(id: number) {
      this.router.navigate(['/meter/newmeterprofile', id]);
    }
  
  
    // On file Select
    onChange(data: any) {
      let file = data.target.files;
      this.excelfile = file.item(0);
    }
  
    onChange1(data: any) {
      let file = data.target.files;
      this.excelfile1 = file.item(0);
    }
  
    onChange2(data: any) {
      let file = data.target.files;
      this.excelfile1 = file.item(0);
    }
  
    onChange3(data: any) {
      let file = data.target.files;
      this.excelfile1 = file.item(0);
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
      this.service.getAllNewMeterRender(this.agridRequest).subscribe((res: any) => {
        this.spinner.hide();
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
      this.service.getAllNewMeterRender(this.agridRequest).subscribe((res: any) => {
        this.spinner.hide();
        if (res.data != null) {
          this.tableData = res.data;
          this.gridApi.setRowData(this.tableData);
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
    exportNewMeterData() {
      this.spinner.show();
      this.service.ExportMeterData().subscribe((response) => {
        this.downLoadFile(response, 'application/ms-excel');
        this.spinner.hide();
      },
        (err) => {
          this.spinner.hide();
          this.toaster.error('Something Went Wrong !!!');
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
    postFile1() {
      $('#exampleModal1').modal('hide');
      this.spinner.show();
      this.service.UploadNewMeterExcel(this.excelfile1).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            $('#exampleModal1').modal('hide');
  
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
  
  
    postFile2() {
      $('#exampleModal2').modal('hide');
      this.spinner.show();
      this.service.UpdateNewMeterLatLong(this.excelfile1).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            $('#exampleModal2').modal('hide');
  
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
  
    postFile3() {
      $('#exampleModal3').modal('hide');
      this.spinner.show();
      this.service.ReplaceMeter(this.excelfile1).subscribe(
        (res: any) => {
          if (res.success) {
            this.toaster.success(res.message);
            $('#exampleModal3').modal('hide');
  
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
  
  
  
    getSelectedRowData() {
  
      let selectedNodes = this.gridApi.getSelectedNodes();
      this.newMeterID = selectedNodes.map(node => node.data.meterID);
      
      this.service.UpdateMeterByMeterIDList(this.newMeterID).subscribe(
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
        this.deleteSelectedRowData(insertOtp);
  
      })
    }
    deleteSelectedRowData(password: string) {
  
      let selectedNodes = this.gridApi.getSelectedNodes();
      let selectedData = selectedNodes.map(node => node.data.meterID);
      let data = {
        id: selectedData,
        password: password
      }
      this.service.DeleteNewMeter(data).subscribe((res: any) => {
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
  
  
  
  
  }
