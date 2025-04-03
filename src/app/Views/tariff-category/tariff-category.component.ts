import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Member } from 'src/app/Model/group';
import { IServiceRequest } from 'src/app/Model/iservice-request';
import { IServiceRequestAdd, ITariffRequestAdd, UploadAtAccessLevel } from 'src/app/Model/iservice-request-add';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

@Component({
  selector: 'app-tariff-category',
  templateUrl: './tariff-category.component.html',
  styleUrls: ['./tariff-category.component.css']
})
export class TariffCategoryComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  rowdata: IServiceRequest[] = [];
  constructor(
    private service: ServiceRequestService,
    private userservice:UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService
    ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Load Data' },
        { extend: 'pdf', title: 'Load Data' },
      ],
    };
    this.onList();
    
  }

  onList() {
    
    this.service.getTariffAll().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.rowdata = res.data;
          this.dtTrigger.next();
          
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        if (err.status == 400)
          this.toastr.error(err);
      }
    );

  }
  



}
