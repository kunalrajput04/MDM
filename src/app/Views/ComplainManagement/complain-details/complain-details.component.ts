import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Complain, ComplainInfo } from 'src/app/Model/complain';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { ComplainService } from 'src/app/Service/complain.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-complain-details',
  templateUrl: './complain-details.component.html',
  styleUrls: ['./complain-details.component.css'],
})
export class ComplainDetailsComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Support',
    levelurl: '',
    menuname: 'Complaint Info',
    url: '/mdm/support/',
  };

  //#endregion

  complain: Complain;
  formData: ComplainInfo = {
    cId: 0,
    referenceId: '',
    description: '',
    title: '',
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

  complainlogs: ComplainInfo[] = [];
  compId: number;
  referid: string;
  constructor(
    private service: ComplainService,
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
    this.compId = this.route.snapshot.params['id'];
    this.getComplainInfo(this.compId);
  }
  getColor() {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  getComplainInfo(data: number) {
    this.service.getInfoById(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.formData = res.data;
          this.formData.description = '';
          this.referid = res.data.referenceId;
          this.getComplainlogs(this.referid);
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

  getComplainlogs(data: string) {
    this.service.getAllByReferenceId(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.complainlogs = res.data;
          this.complainlogs.forEach((data) => {
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

  manageCupport() {
    this.service.manageComplain(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.getComplainInfo(this.compId);
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
