import {
  Component,
  OnInit,
} from '@angular/core';
import { MeterReport, NewMeterReport } from 'src/app/Model/meter-report';
import { NewMeterService } from 'src/app/Service/new-meter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/Service/user.service';
import { DropDown } from 'src/app/Model/drop-down';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  role: any;
  IsContractor: boolean = false;
  IsAdmin: boolean = false;
  formdata: MeterReport = new MeterReport();
  newMeterList: NewMeterReport[] = [];
  title = 'angulardatatables';
  fileUrl: string = '';
  excelfile: any;

  tableData: NewMeterReport[] = [];
  isContractorrole: boolean = false;
  isElectricain: boolean = false;
  contractordrop: DropDown[] = [];
  electricaindrop: DropDown[] = [];


  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  gridOptions: any;
  enableCellTextSelection: boolean = true;
  pageOption: string = '500';
  rowSelection = 'multiple';

  constructor(
    private newmeter: NewMeterService,
    private spinner: NgxSpinnerService,
    private userservice: UserService,
    private datePipe: DatePipe,
    private toaster: ToastrService
  ) {

    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'customerNo' },
      { field: 'newCustomerNo' },
      { field: 'customerName' },
      { field: 'aadharNo' },
      { field: 'bookNo' },
      { field: 'houseno' },
      { field: 'villageName' },
      { field: 'censusCode' },
      { field: 'cableLength' },
      { field: 'address' },
      { field: 'substationName' },
      { field: 'subdivisionName' },
      { field: 'feederName' },
      { field: 'dtName' },
      { field: 'meterSerialNumber' },
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

      { field: 'latitude' },
      { field: 'longitude' },
      { field: 'createdDate' },
      { field: 'fullName' }

    ];

  }

  ngOnInit(): void {
    this.formdata.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.getLoginStatus();


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
    this.formdata.meterType = 'New';
    this.newmeter.getAllNewMeterReport(this.formdata).subscribe((res: any) => {
      this.spinner.hide();
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
    this.gridApi.showLoadingOverlay();
    this.formdata.meterType = 'New';
    this.newmeter.getAllNewMeterReport(this.formdata).subscribe((res: any) => {
      if (res.data != null) {
        this.spinner.hide();
        this.tableData = res.data;
        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();
      }
    }, (err) => {


      this.gridApi.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
      this.toaster.error('Something went wrong, please try again');
    });
  }
  getRecordNumber() {
    if (this.pageOption == 'All')
      this.formdata.length = -1;
    else if (this.pageOption != 'Customize')
      this.formdata.length = parseInt(this.pageOption);
    if (this.pageOption != 'Customize')
      this.onSubmit();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  getLoginStatus() {
    if (localStorage.getItem('RoleName') != null) {
      this.role = localStorage.getItem('RoleName');
      if (this.role == 'Contractor' || this.role == 'CONTRACTOR') {
        this.IsContractor = true;
      }
      if (this.role == 'Superadmin' || this.role == 'Admin') {
        this.IsAdmin = true;
      }
    }
  }


  changeRole() {
    if (this.formdata.roleType == 'Contractor') {
      this.isContractorrole = true;
      this.isElectricain = false;
    //  this.getContractor();
    } else if (this.formdata.roleType == 'Electrician') {
      this.isContractorrole = true;
      this.isElectricain = true;
     // this.getContractor();
    } else {
      this.isContractorrole = false;
      this.isElectricain = false;
    }
  }

  // getContractor() {
  //   this.userservice.getContractorDropDown().subscribe((res: any) => {
  //     if (res.data != null) {
  //       this.spinner.hide();
  //       this.contractordrop = res.data;
  //     }
  //   });
  // }
  // getElectricain(data: any) {
  //   this.userservice
  //     .getElectricainDropDown(data.target.value)
  //     .subscribe((res: any) => {
  //       if (res.data != null) {
  //         this.spinner.hide();
  //         this.electricaindrop = res.data;
  //       }
  //     });
  // }
}
