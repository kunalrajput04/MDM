import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';

import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

export interface ConnectDisconnect {
  devicesrno: string;
  command: string;
}

@Component({
  selector: 'app-on-demand',
  
  templateUrl: './on-demand.component.html',
  styleUrls: ['./on-demand.component.css'],
})
export class OnDemandComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'MDM',
    levelurl: '',
    menuname: 'On-Demand',
    url: '/mdm/meterdata/OnDemand',
  };
  formdata: ConnectDisconnect = {
    command: '',
    devicesrno: '',
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

  consumerno: any[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  constructor(
    private service: DataService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {}

  getConsumerDetails(data: any) {
    this.storeservice
      .getConsumerMeter(data.consumerNumber)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.consumerformdata = res.data;
        }
      });
  }

  getConsumers(data: any) {
    let consumernumber = data.target.value;
    if (consumernumber.length > 3) {
      this.loading = true;
      this.storeservice.getConsumerWithMeterNo(consumernumber).subscribe(
        (res: any) => {
          this.consumerno = res.data;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }

  onSubmit() {
    if (this.formdata.command === 'InstantRead') {
      this.onSubmitInstantReadCMD();
    } else if (this.formdata.command === 'PingMeter') {
      this.onSubmitPingMeterCMD();
    } else if (this.formdata.command === 'FullData') {
      this.onSubmitFullDataCMD();
    } else if (this.formdata.command === 'Connect') {
      this.onSubmitConnectCMD();
    } else if (this.formdata.command === 'Disconnect') {
      this.onSubmitDisconnectCMD();
    }
  }
  
  onSubmitInstantReadCMD() {
    // Implement your code for InstantRead here
    // Call the connectDisconnect service with 'InstantRead' command and device serial number
    // Example:
    // Replace the following line with your actual service call:
    this.service.connectDisconnect('InstantRead', this.formdata.devicesrno)
      .subscribe((res: any) => {
        if (res.result === true) {
          this.toaster.success('Instant Read Command Given Successfully');
          this.clearForm();
        } else {
          this.toaster.warning('Instant Read Command added to the queue.');
        }
      });
  }
  
  onSubmitPingMeterCMD() {
    // Implement your code for PingMeter here
    // Call the connectDisconnect service with 'PingMeter' command and device serial number
    // Example:
    // Replace the following line with your actual service call:
    this.service.connectDisconnect('PingMeter', this.formdata.devicesrno)
      .subscribe((res: any) => {
        if (res.result === true) {
          this.toaster.success('Ping Meter Command Given Successfully');
          this.clearForm();
        } else {
          this.toaster.warning('Ping Meter Command added to the queue.');
        }
      });
  }
  
  onSubmitFullDataCMD() {
    // Implement your code for FullData here
    // Call the connectDisconnect service with 'FullData' command and device serial number
    // Example:
    // Replace the following line with your actual service call:
    this.service.connectDisconnect('FullData', this.formdata.devicesrno)
      .subscribe((res: any) => {
        if (res.result === true) {
          this.toaster.success('Full Data Command Given Successfully');
          this.clearForm();
        } else {
          this.toaster.warning('Full Data Command added to the queue.');
        }
      });
  }
  
  onSubmitConnectCMD() {
    // Implement your code for Connect here
    // Call the connectDisconnect service with 'Connect' command and device serial number
    // Example:
    // Replace the following line with your actual service call:
    this.service.connectDisconnect('Connect', this.formdata.devicesrno)
      .subscribe((res: any) => {
        if (res.result === true) {
          this.toaster.success('Connect Command Given Successfully');
          this.clearForm();
        } else {
          this.toaster.warning('Connect Command added to the queue.');
        }
      });
  }
  
  onSubmitDisconnectCMD() {
    // Implement your code for Disconnect here
    // Call the connectDisconnect service with 'Disconnect' command and device serial number
    // Example:
    // Replace the following line with your actual service call:
    this.service.connectDisconnect('Disconnect', this.formdata.devicesrno)
      .subscribe((res: any) => {
        if (res.result === true) {
          this.toaster.success('Disconnect Command Given Successfully');
          this.clearForm();
        } else {
          this.toaster.warning('Disconnect Command added to the queue.');
        }
      });
  }
  
  
  clearForm() {
    this.formdata = {
      command: '',
      devicesrno: '',
    };
  }
}
