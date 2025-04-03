import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Complain } from 'src/app/Model/complain';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { ComplainService } from 'src/app/Service/complain.service';
import { UserService } from 'src/app/Service/user.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-add-complain',
  templateUrl: './add-complain.component.html',
  styleUrls: ['./add-complain.component.css'],
})
export class AddComplainComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Support',
    levelurl: '',
    menuname: 'Add Complaint',
    url: '/mdm/support/',
  };

  //#endregion

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

  formData: Complain = {
    cId: 0,
    referenceId: '',
    description: '',
    title: '',
    type: '',
    created: new Date(),
    isActive: true,
    assignId: 0,
    consumerName: '',
  };
  consumerno: string[] = [];
  members: Member[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;
  constructor(
    private service: ComplainService,
    private UserService: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private storeservice: SmartMeterService,
    private config: NgSelectConfig,
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

  cleanForm() {
    this.formData = {
      cId: 0,
      referenceId: '',
      description: '',
      title: '',
      type: '',
      created: new Date(),
      isActive: true,
      assignId: 0,
      consumerName: '',
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
        }
      });
  }
}
