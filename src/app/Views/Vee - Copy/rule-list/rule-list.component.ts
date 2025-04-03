import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { VeeRules } from 'src/app/Model/vee-rules';
import { AuthService } from 'src/app/Service/auth.service';
import { VeeService } from 'src/app/Service/vee.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.css'],
})
export class RuleListComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'VEE',
    levelurl: '',
    menuname: 'Rules',
    url: '/mdm/vee/',
  };

  //#endregion

  headerdata = [];
  rowdata = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  ruleList: string[] = [];
  formdata: VeeRules = {
    ruleName: '',
    userName: localStorage.getItem('Name'),
    startDate: '',
    endDate: '',
  };

  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;

  selectedRuleName: string = '';

  constructor(
    private service: VeeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = { resizable: true, filter: true, sortable: true }
    this.columnDefs = [
    ];
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],

      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };
    this.getList();
  }

  getList() {
    
    this.service.getAll().subscribe(
      (res: any) => {
        this.ruleList = res;
        this.dtTrigger.next();
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  deleteRule(ruleName: string) {
    Swal.fire({
      title: 'Are you sure?',

      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteRule(ruleName).subscribe(
          (res: any) => {
            Swal.fire(res.message, '', 'success');
            this.dtTrigger.next();

            
          },
          (err) => {
            
            if (err.status == 400) this.toastr.error(err);
          }
        );
      }
    });
  }
  setRuleName(ruleName: string) {
    this.selectedRuleName = ruleName;
    const colDefs = this.gridApi.getColumnDefs();
    colDefs.length = 0;
    this.gridApi.setColumnDefs(colDefs);
    this.gridApi.setRowData([]);
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
  }
  getAppliedRules() {

    this.formdata.startDate = this.datePipe.transform(this.formdata.startDate, 'yyyy-MM-dd hh:mm:ss');
    this.formdata.endDate = this.datePipe.transform(this.formdata.endDate, 'yyyy-MM-dd hh:mm:ss');
    this.formdata.ruleName = this.selectedRuleName;
    
    this.service.getappliedRules(this.formdata).subscribe((res: any) => {

      
      if (res != null) {
        if (res.code == undefined) {
          let tableData = [];
          tableData = res;
          if (tableData.length > 0) {
            const colDefs = this.gridApi.getColumnDefs();
            colDefs.length = 0;
            var keys = Object.keys(tableData[0]);
            keys.forEach(key => colDefs.push({ field: key }));
            this.gridApi.setColumnDefs(colDefs);
          }
          this.gridApi.setRowData(tableData);
        }
        else {
          this.toastr.error(res.message);
        }
      }
    },

      (err) => {
        
        this.toastr.error(err.error.message);
      });
  }
}
