import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { IServiceRequestAdd } from 'src/app/Model/iservice-request-add';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-update-service-request',
  templateUrl: './update-service-request.component.html',
  styleUrls: ['./update-service-request.component.css'],
})
export class UpdateServiceRequestComponent implements OnInit {
  isAssignUser: boolean = false;
  members: Member[] = [];
  consumerformdata: ConsumerMeterInfo = {
    aadharNo: '',
    address: '',
    billingCategory: '',
    customerName: '',
    customerNo: '',
    dtName: '',
    feederName: '',
    iPv6Address: '',
    latitude: '',
    longitude: '',
    meterSerialNumber: '',
    meterType: '',
    newConsumerNo: '',
    simImei: '',
    simType: '',
    subdivisionName: '',
    substationName: '',
    whatsappNo: '',
    consumerType: '',
    currentBalance: '',
    lastRechargeDate: '',
    city: '',
    pincode: '',
    tariffName: '',
  };
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
  consumerno: string[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  constructor(
    private router: Router,
    private userservice: UserService,
    private storeservice: SmartMeterService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private service: ServiceRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getMembers();
    this.formData.requestID = this.route.snapshot.params['id'];
    this.getRequestDetails(this.formData.requestID);
  }

  getConsumers(data: any) {
    let consumernumber = data.target.value;
    if (consumernumber.length > 3) {
      this.loading = true;
      this.storeservice.getConsumerNumberList(consumernumber).subscribe(
        (res: any) => {
          this.consumerno = res.data;
          this.loading = false;
        },
        (err) => {}
      );
    }
  }
  getConsumerDetails() {
    this.storeservice
      .getConsumerMeter(this.formData.consumerNumber)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.consumerformdata = res.data;
        }
      });
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }

  getRequestDetails(requestID: number) {
    this.service.getRequestDetails(requestID).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.formData = res.data;

          this.getConsumerDetails();
          if (localStorage.getItem('Name') == this.formData.requestByName)
            this.isAssignUser = false;
          else this.isAssignUser = true;
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
  manageRequest() {
    this.service.manageRequest(this.formData).subscribe(
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
