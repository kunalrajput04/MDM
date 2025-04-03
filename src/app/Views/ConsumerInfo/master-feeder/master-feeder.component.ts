import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DropDown } from 'src/app/Model/drop-down';
import { Feeders } from 'src/app/Model/feeder';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-master-feeder',
  templateUrl: './master-feeder.component.html',
  styleUrls: ['./master-feeder.component.css']
})
export class MasterFeederComponent implements OnInit {
  constructor(
      private service: MasterService,
      private toaster: ToastrService,
      private spinner: NgxSpinnerService,
      private datePipe: DatePipe
    ) {}
    feederForm: Feeders = new Feeders();
    subdivisionDrop: DropDown[] = [];
    substationDrop: DropDown[] = [];
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
          title: 'Feeder '+ latest_date +''
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
    manageFeeder(formdata: NgForm) {
      this.spinner.show();
      this.service.manageFeeder(formdata.value).subscribe(
        (res: any) => {
          if (res.success) {
            this.spinner.hide();
            this.toaster.success(res.message);
            this.feederForm = new Feeders();
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
      this.service.GetAllFeeder().subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.success) {
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
    GetData(data: Feeders) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.subStationDropDown(data.subDivisionID);
      this.feederForm.feederID = data.feederID;
  
      this.feederForm.subStationID = data.subStationID;
      this.feederForm.subDivisionID = data.subDivisionID;
      this.feederForm.feederName = data.feederName;
      this.feederForm.isActive = data.isActive;
    }
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
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
  }
