import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DropDown } from 'src/app/Model/drop-down';
import { DT } from 'src/app/Model/dt';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-master-dt',
  templateUrl: './master-dt.component.html',
  styleUrls: ['./master-dt.component.css']
})
export class MasterDtComponent implements OnInit {
    constructor(
      private service: MasterService,
      private toaster: ToastrService,
      private spinner: NgxSpinnerService,
      private datePipe: DatePipe
    ) {}
    dtForm: DT = new DT();
    subdivisionDrop: DropDown[] = [];
    substationDrop: DropDown[] = [];
    feederDrop: DropDown[] = [];
    data: any[] = [];
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();
  
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
  
    ngOnInit(): void {
      let latest_date =this.datePipe.transform(new Date(), 'dd-MM-yyyy');
      this.subDivisionDropDown();
      this.dtOptions = {
        dom: 'Bfrtip',
        // Configure the buttons
        buttons: ['print', {
          extend: 'excel',
          title: 'DT '+ latest_date +''
        }],
      };
      this.onGridReady();
    }
  
    subDivisionDropDown() {
      this.service.GetSubdivisonDropDown().subscribe(
        (res: any) => {
          if (res.success) {
            this.subdivisionDrop = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  
    subStationDropDown(data: any) {
      let divisionid = data;
      this.service.GetSubstationDropDown(divisionid).subscribe(
        (res: any) => {
          if (res.success) {
            this.substationDrop = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  
    feederDropDown(data: any) {
      let divisionid = data;
      this.service.GetFeederDropDown(divisionid).subscribe(
        (res: any) => {
          if (res.success) {
            this.feederDrop = res.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  
    manageDT(formdata: NgForm) {
      this.spinner.show();
      this.service.manageDT(formdata.value).subscribe(
        (res: any) => {
          if (res.success) {
            this.spinner.hide();
            this.toaster.success(res.message);
            this.dtForm = new DT();
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
  
    onGridReady() {
      this.spinner.show();
      this.service.GetAllDT().subscribe(
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
  
    rerender(): void {
      this.onGridReady();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
  
    GetData(data: DT) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
  
      this.subStationDropDown(data.subDivisionID);
      this.feederDropDown(data.subStationID);
      this.dtForm.feederID = data.feederID;
      this.dtForm.dtid = data.dtid;
      this.dtForm.subStationID = data.subStationID;
      this.dtForm.subDivisionID = data.subDivisionID;
      this.dtForm.dtName = data.dtName;
      this.dtForm.isActive = data.isActive;
    }
  }
