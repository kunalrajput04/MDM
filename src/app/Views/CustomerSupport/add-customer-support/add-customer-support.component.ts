import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { Support } from 'src/app/Model/support';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SupportService } from 'src/app/Service/support.service';

@Component({
  selector: 'app-add-customer-support',
  templateUrl: './add-customer-support.component.html',
  styleUrls: ['./add-customer-support.component.css'],
})
export class AddCustomerSupportComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Support',
    levelurl: '',
    menuname: 'Add Ticket',
    url: '/mdm/support/',
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

  formData: Support = {
    sId: 0,
    referenceId: '',
    description: '',
    heading: '',
    created: new Date(),
    isActive: true,
    consumerName: '',
    createdUserName: '',
    assignId: 0,
    type: '',
  };
  consumerno: string[] = [];
  loading: boolean = false;
  members: Member[] = [];
  virtualScroll: boolean = true;
  constructor(
    private service: SupportService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private config: NgSelectConfig,
    private storeservice: SmartMeterService,
    private UserService: UserService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.config.notFoundText = 'Consumer not found';
    this.config.loadingText = 'Data loading...';
    this.config.placeholder = 'Select Consumer ';
  }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.UserService.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
        console.log(this.members);
      },
      (err) => {}
    );
  }

  manageSupport() {
    this.service.Create(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.cleanForm();
          this.router.navigateByUrl['/mdm/support'];
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
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
  cleanForm() {
    this.formData = {
      sId: 0,
      referenceId: '',
      description: '',
      heading: '',
      created: new Date(),
      isActive: true,
      consumerName: '',
      createdUserName: '',
      assignId: 0,
      type: '',
    };
  }

  cancel() {
    this.cleanForm();
  }

  getConsumerDetails() {
    this.storeservice
      .getConsumerMeter(this.formData.consumerName)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.consumerformdata = res.data;
        } else {
        }
      });
  }
}
