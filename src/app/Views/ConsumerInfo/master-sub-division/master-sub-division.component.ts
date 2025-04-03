import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subdivisions } from 'src/app/Model/subdivision';
import { MasterService } from 'src/app/Service/master.service';

import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-master-sub-division',
  templateUrl: './master-sub-division.component.html',
  styleUrls: ['./master-sub-division.component.css']
})
export class MasterSubDivisionComponent implements OnInit {
  data: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  constructor(
    private service: MasterService,
    private toaster: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {}
  subdivisionForm: Subdivisions = new Subdivisions();

  ngOnInit(): void {
    let latest_date =this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.dtOptions = {
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: ['print', {
        extend: 'excel',
        title: 'SUBDIVISION '+ latest_date +''
      }],
    };
    this.onGridReady();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  onGridReady() {
    this.spinner.show();
    this.service.GetSubdivisonDropDown().subscribe(
      (res: any) => {
        if (res.success) {
          this.spinner.hide();
          this.data = res.data;
          this.dtTrigger.next();
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
  GetData(data: Subdivisions) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.subdivisionForm.subDivisionID = data.subDivisionID;
    this.subdivisionForm.subDivisionName = data.subDivisionName;
    this.subdivisionForm.isActive = data.isActive;
  }

  manageSubdivision(formdata: NgForm) {
    this.spinner.show();
    this.service.manageSubdivision(formdata.value).subscribe(
      (res: any) => {
        if (res.success) {
          this.spinner.hide();
          this.toaster.success(res.message);
          this.subdivisionForm = new Subdivisions();
          this.rerender();
        }
      },
      (err) => {
        this.spinner.hide();
        if (err.status == 400)
          this.toaster.error('Something Went Wrong', 'Authentication failed.');
      }
    );
  }
  rerender(): void {
    this.onGridReady();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }
}