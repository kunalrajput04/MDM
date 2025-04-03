import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  ConsumerInformation,
  MeterData,
  MeterInfomation,
} from 'src/app/Model/meter-data';
import { DataService } from 'src/app/Service/data.service';
import { icon, latLng, Layer, MapOptions, marker, tileLayer } from 'leaflet';
import { DeviceInformation, getDevice } from 'src/app/Model/device-information';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { DTService } from 'src/app/Service/dt.service';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { ConsumerCount } from 'src/app/Model/prepaid-postpaid';
import { AuthService } from 'src/app/Service/auth.service';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PrepaidService } from 'src/app/Service/prepaid.service';
import { TarrifDropdown } from 'src/app/Model/new-tarrif';
@Component({
  selector: 'app-consumer-info-view',
  templateUrl: './consumer-info-view.component.html',
  styleUrls: ['./consumer-info-view.component.css'],
})
export class ConsumerInfoViewComponent implements OnInit {
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
  formdata: getDevice = new getDevice();
  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'Consumer',
    levelurl: '',
    menuname: 'Consumer Information',
    url: '/mdm/consumer/',
  };

  iserror: boolean = false;
  isData: boolean = false;
  mapOptions: MapOptions;
  map: any;
  markers: Layer[] = [];
  isLatLongExists: boolean = false;
  isEdit: boolean = true;
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  @ViewChild('closebutton') closebutton;
  consumerno: string[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;
  consumerCount: ConsumerCount = {
    date: new Date(),
    postpaid: 0,
    postpaidHT: 0,
    postpaidLT: 0,
    postpaidSingle: 0,
    postpaidThree: 0,
    prepaid: 0,
    prepaidSingle: 0,
    prepaidThree: 0,
    total: 0,
  };
  constructor(
    private toastr: ToastrService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feeder: FeederService,
    private dtservice: DTService,
    private storeservice: SmartMeterService,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private service: PrepaidService
  ) {
    this.authservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.formdata.deviceNo = this.route.snapshot.params['id'];
    this.initializeMapOptions();
    this.onSubmit();
    this.getTarrifDown();
  }
  getLevelValue() {
    this.getSubdivision();
    this.getSubstation(this.consumerformdata.subdivisionName);
    this.getFeeder(this.consumerformdata.substationName);
    this.getDT(this.consumerformdata.feederName);
  }
  onSubmit() {
    this.storeservice
      .getConsumerMeter(this.formdata.deviceNo)
      .subscribe((res: any) => {
        if (res.data != null) {
          this.isData = true;
          this.iserror = false;
          this.consumerformdata = res.data;

          if (
            this.consumerformdata.latitude != '--' &&
            this.consumerformdata.latitude != '0' &&
            this.consumerformdata.latitude != 'null'
          ) {
            this.isLatLongExists = true;

            const newMarker = marker(
              [
                parseFloat(this.consumerformdata.latitude),
                parseFloat(this.consumerformdata.longitude),
              ],
              {
                icon: icon({
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                  iconUrl: '/assets/images/usermapicon.png',
                }),
              }
            );
            this.markers.push(newMarker);

            this.mapOptions = {
              center: latLng(
                parseFloat(this.consumerformdata.latitude),
                parseFloat(this.consumerformdata.longitude)
              ),
              zoom: 9,
              layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 18,
                  attribution: 'Map data © OpenStreetMap contributors',
                }),
              ],
            };
          } else {
            this.isLatLongExists = false;
          }
        } else {
          this.toastr.error('Oops!! something went wrong');
          this.iserror = true;
          this.isData = false;
        }
      });
  }

  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(25.487389, 90.412735),
      zoom: 9,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }

  getSubdivision() {
    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
      if (res != null) {
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      }
    });
  }

  getSubstation(subdivision: string) {
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        this.substatioDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getFeeder(substation: string) {
    this.feeder.getFeederBySubstation(substation).subscribe((res: any) => {
      this.feederDropDown = [];
      if (res.data != null) {
        let obj = res.data[0];
        for (var item in obj) {
          this.feederDropDown.push(obj[item][0]);
        }
      }
    });
  }
  saveDevice(form: NgForm) {
    this.closebutton.nativeElement.click();

    if (form.value != null) {
      this.storeservice
        .manageConsumer(this.consumerformdata)
        .subscribe((res: any) => {
          if (res != null) {
            if (res.success == true) {
              if (this.isEdit) {
                this.toastr.success(res.message);
                // this.rerender();
              } else {
                //this.rerender();
                this.toastr.success(res.message);
              }
            }
          } else {
            alert('Oops!! something went wrong');
          }
        });
    }
  }
  getDT(feeder: string) {
    this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
      this.dtDropDown = [];
      if (res.data != null) {
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      }
    });
  }
  getTarrifDown() {
    this.service.GetAllTariffDropdown().subscribe(
      (res: any) => {
        this.tarrif = res.data;
      },
      (err) => {}
    );
  }
}
