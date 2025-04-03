import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DropDown } from 'src/app/Model/drop-down';
import { Substation1 } from 'src/app/Model/substation';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-master-sub-station',
  templateUrl: './master-sub-station.component.html',
  styleUrls: ['./master-sub-station.component.css']
})
export class MasterSubStationComponent implements OnInit {
   data: any[] = [];
    substationForm: Substation1 = new Substation1();
    subdivisionDrop: DropDown[] = [];
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();
  
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    constructor(
      private service: MasterService,
      private toaster: ToastrService,
      private spinner: NgxSpinnerService,
      private datePipe: DatePipe
    ) {}
  
    ngOnInit(): void {
      let latest_date =this.datePipe.transform(new Date(), 'dd-MM-yyyy');
      this.subDivisionDropDown();
      this.dtOptions = {
        dom: 'Bfrtip',
        // Configure the buttons
        buttons: ['print', {
          extend: 'excel',
          title: 'SUBSTATION'+ latest_date +''
        }],
      };
      this.onGridReady();
    }
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
    onGridReady() {
      this.spinner.show();
      this.service.GetAllSubstation().subscribe(
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
  
    manageSubstation(formdata: NgForm) {
      this.spinner.show();
      this.service.manageSubstation(formdata.value).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.success) {
            this.toaster.success(res.message);
            this.substationForm = new Substation1();
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
    GetData(data: Substation1) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.substationForm.subStationID = data.subStationID;
      this.substationForm.subDivisionID = data.subDivisionID;
      this.substationForm.subStationName = data.subStationName;
      this.substationForm.isActive = data.isActive;
    }
  }
