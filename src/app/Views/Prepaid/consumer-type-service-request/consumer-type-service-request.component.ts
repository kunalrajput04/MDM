import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { IBillingConsumer } from 'src/app/Model/ibilling-consumer';
import { IServiceRequestAdd } from 'src/app/Model/iservice-request-add';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-consumer-type-service-request',
  templateUrl: './consumer-type-service-request.component.html',
  styleUrls: ['./consumer-type-service-request.component.css'],
})
export class ConsumerTypeServiceRequestComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isAssignUser: boolean = false;
  members: Member[] = [];
  dataList: IBillingConsumer[] = [];
  isLoad: boolean = false;
  formData: IServiceRequestAdd = {
    requestID: 0,
    requestByName: localStorage.getItem('Name'),
    requestReason: '',
    requestType: '',
    response: '',
    remarks: '',
    requestTo: '',
    consumerNumber: '',
    requestStatus: 'Pending',
    accessLevel: localStorage.getItem('AccessLevel'),
    accessValue: localStorage.getItem('AccessValue'),
  };

  constructor(
    private router: Router,
    private userservice: UserService,
    private storeservice: SmartMeterService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private service: ServiceRequestService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],

      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Load Data' },
        { extend: 'pdf', title: 'Load Data' },
      ],
    };
    this.getMembers();
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }

  onList() {
    if (this.isLoad) this.rerender();
    
    this.service
      .getConsumerByBillingType(this.formData.consumerNumber)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            
            this.dataList = res.data;
            this.dtTrigger.next();

            this.isLoad = true;
          } else {
            this.toastr.error(res.message);
          }
          
        },
        (err) => {
          
          if (err.status == 400) this.toastr.error(err);
        }
      );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    });
  }

  manageRequest() {
    
    this.service.uploadmultipleRequest(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.router.navigate(['/mdm/prepaid/servicerequest']);
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
}
