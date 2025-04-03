import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { Support, SupportInfo } from 'src/app/Model/support';
import { AuthService } from 'src/app/Service/auth.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SupportService } from 'src/app/Service/support.service';

@Component({
  selector: 'app-customer-support-details',
  templateUrl: './customer-support-details.component.html',
  styleUrls: ['./customer-support-details.component.css'],
})
export class CustomerSupportDetailsComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Support',
    levelurl: '',
    menuname: 'Ticket Info',
    url: '/mdm/support/',
  };

  //#endregion

  support: Support;
  formData: SupportInfo = {
    sId: 0,
    referenceId: '',
    description: '',
    heading: '',
    type: '',
    created: new Date(),
    isActive: true,
    assignId: 0,
    assign: '',
    nameInitial: '',
    status: '',
    consumerName: '',
    createdUserName: '',
  };

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
  supportlogs: SupportInfo[] = [];
  supportId: number;
  referid: string;

  constructor(
    private service: SupportService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private storeservice: SmartMeterService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.supportId = this.route.snapshot.params['id'];
    console.log(this.supportId);
    this.getsupportInfo(this.supportId);
  }

  getColor() {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  getsupportInfo(data: number) {
    this.service.getInfoById(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.formData = res.data;
          this.formData.description = '';
          this.referid = res.data.referenceId;
          this.getSuppportlogs(this.referid);
          this.getConsumerDetails(res.data.consumerName);
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  getSuppportlogs(data: string) {
    this.service.getAllByReferenceId(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.supportlogs = res.data;
          this.supportlogs.forEach((data) => {
            data.nameInitial = this.getNameInital(data.createdUserName);
          });
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  getNameInital(username): string {
    const fullName = username.split(' ');
    if (fullName.length > 1) {
      const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
      return initials.toUpperCase();
    } else {
      const initials = fullName.shift().charAt(0);
      return initials.toUpperCase();
    }
  }

  manageSupport() {
    this.service.manageSupport(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.getsupportInfo(this.supportId);
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  getConsumerDetails(data: any) {
    this.storeservice.getConsumerMeter(data).subscribe((res: any) => {
      if (res.data != null) {
        this.consumerformdata = res.data;
      }
    });
  }
}
