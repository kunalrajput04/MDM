import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { ConsumerUpdateRequest } from 'src/app/Model/iservice-request';
import { TarrifDropdown } from 'src/app/Model/new-tarrif';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-crete-request',
  templateUrl: './crete-request.component.html',
  styleUrls: ['./crete-request.component.css'],
})
export class CreteRequestComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Service Order',
    levelurl: '',
    menuname: 'New Requests ',
    url: '/mdm/prepaid',
  };
  tarrif: TarrifDropdown[] = [];
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
  formdata: ConsumerUpdateRequest = {
    requestID: 0,
    requestNumber: '',
    requestStatus: '',
    consumerNo: '',
    requestReason: '',
    response: '',
    assignTo: 0,
    changeTo: '',
    netMetering: '',
    billingTarrif: 0,
    pendingAmount: 0,
    arial: '',
    remarks: '',
    autoDisconnect: false,
    updated: new Date(),
  };
  members: Member[] = [];

  consumerno: string[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;
  constructor(
    private service: PrepaidService,
    private toastr: ToastrService,
    private router: Router,
    private userservice: UserService,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.getTarrifDown();
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

  getTarrifDown() {
    this.service.GetAllTariffDropdown().subscribe(
      (res: any) => {
        this.tarrif = res.data;
      },
      (err) => {}
    );
  }

  onSubmit() {
    this.service.ManageConsumerRequest(this.formdata).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.router.navigate['/mdm/prepaid/UpdateRequests'];
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
  getConsumerDetails() {
    this.storeservice
      .getConsumerMeter(this.formdata.consumerNo)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.consumerformdata = res.data;
        }
      });
  }
}
