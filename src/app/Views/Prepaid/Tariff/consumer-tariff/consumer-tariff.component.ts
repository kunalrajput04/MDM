import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { ITariffRequestAdd } from 'src/app/Model/iservice-request-add';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-consumer-tariff',
  templateUrl: './consumer-tariff.component.html',
  styleUrls: ['./consumer-tariff.component.css'],
})
export class ConsumerTariffComponent implements OnInit {
  formData: ITariffRequestAdd = {
    requestID: 0,
    sectionLoad: '',
    requestByName: localStorage.getItem('Name'),
    requestReason: '',
    requestType: '',
    response: '',
    remarks: '',
    requestTo: '',
    consumerNumber: '',
    requestValue: '',
    requestStatus: 'Pending',
    oldTariff: '0',
    newTariff: '0',
    meterType: '',
    supplyCategory: '',
    billingCategory: '',
    monthlyRental: 0,
    tarrifRate1: 0,
    tarrifRate2: 0,
    tarrifRate3: 0,
    gstRate: 0,
    lowBalance: 0,
    tarrifName: '',
    tarrifStart: '',
    accessLevel: localStorage.getItem('AccessLevel'),
    accessValue: localStorage.getItem('AccessValue'),
  };
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

  consumerno: string[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  constructor(
    private service: ServiceRequestService,
    private userservice: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private storeservice: SmartMeterService
  ) {}

  ngOnInit(): void {
    this.getMembers();
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
  manageRequest() {
    this.service.manageTariffRequest(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.router.navigate(['/mdm/prepaid/tariff']);
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
