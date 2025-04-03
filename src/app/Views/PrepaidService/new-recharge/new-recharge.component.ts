import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PrepaidRecharge } from 'src/app/Model/prepaid-recharge';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-new-recharge',
  templateUrl: './new-recharge.component.html',
  styleUrls: ['./new-recharge.component.css'],
})
export class NewRechargeComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Prepaid Service',
    levelurl: '',
    menuname: 'New Recharge',
    url: '/mdm/PrepaidService/',
  };
  //#endregion

  formdata: PrepaidRecharge = {
    id: 0,
    consumerNo: '',
    meterSerialNo: '',
    transactionId: '',
    mode: '',
    amount: 0,
    ischeque: false,
    chequeBank: '',
    chequeBranch: '',
    chequeDate: '',
    chequeNumber: '',
    chequePenality: 0,
    isChequeBounce: false,
    created: new Date(),
    isActive: true,
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

  consumerno: string[] = [];
  loading: boolean = false;
  members: Member[] = [];
  virtualScroll: boolean = true;

  constructor(
    private service: PrepaidService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authservice: AuthService,
    private config: NgSelectConfig,
    private UserService: UserService,
    private router: Router,
    private storeservice: SmartMeterService
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
      },
      (err) => {}
    );
  }

  getConsumers(data: any) {
    let consumernumber = data.target.value;
    if (consumernumber.length > 3) {
      this.loading = true;
      this.storeservice.getPrepaidConsumerNumberList(consumernumber).subscribe(
        (res: any) => {
          this.consumerno = res.data;
          this.loading = false;
        },
        (err) => {}
      );
    }
  }

  getConsumerDetails() {
    this.storeservice.getConsumerMeter(this.formdata.consumerNo).subscribe(
      (res: any) => {
        if (res.data != null) {
          this.consumerformdata = res.data;
        } else {
        }
      },
      (err) => {}
    );
  }

  manageRecharge() {
    this.formdata.meterSerialNo = this.consumerformdata.meterSerialNumber;

    this.service.ManageRecharge(this.formdata).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.router.navigate(['/mdm/PrepaidService/rechargeHistory']);
        } else {
          this.toastr.error(res.message);
        }
      },

      (err) => {}
    );
  }

  onPaymentMode(data: any) {
    if (data != null) {
      if (data == 'Cheque') {
        this.formdata.ischeque = true;
      } else {
        this.formdata.ischeque = false;
      }
    }
  }
}
