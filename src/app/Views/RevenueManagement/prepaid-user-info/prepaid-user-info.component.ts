import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { icon, latLng, Layer, MapOptions, marker, tileLayer } from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { getDevice } from 'src/app/Model/device-information';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PaymentViewModel } from 'src/app/Model/payment';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { RazorPayService } from 'src/app/Service/razor-pay.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

@Component({
  selector: 'app-prepaid-user-info',
  templateUrl: './prepaid-user-info.component.html',
  styleUrls: ['./prepaid-user-info.component.css'],
})
export class PrepaidUserInfoComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Consumer Information',
    url: '/mdm/revenue/',
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
  formdata: getDevice = new getDevice();
  headerdata = [];
  rowdata = [];
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
  customerNo: string;
  @ViewChild('closebutton') closebutton;
  rechargeList: PaymentViewModel[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private service: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feeder: FeederService,
    private dtservice: DTService,
    private storeservice: SmartMeterService,
    private route: ActivatedRoute,
    private payment: RazorPayService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.initializeMapOptions();
    this.getUserInfo(this.route.snapshot.params['cno']);
    this.rechargHistory(this.route.snapshot.params['cno']);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };
  }

  getLevelValue() {
    this.getSubdivision();
    this.getSubstation(this.consumerformdata.subdivisionName);
    this.getFeeder(this.consumerformdata.substationName);
    this.getDT(this.consumerformdata.feederName);
  }

  getUserInfo(data: any) {
    this.storeservice.getConsumerMeter(data).subscribe((res: any) => {
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

        let obj = res.data[0];
        for (var item in obj) {
          this.substatioDropDown.push(obj[item][0]);
        }
      });
  }
  getFeeder(substation: string) {
    this.feeder.getFeederBySubstation(substation).subscribe((res: any) => {
      this.feederDropDown = [];

      let obj = res.data[0];
      for (var item in obj) {
        this.feederDropDown.push(obj[item][0]);
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

      let obj = res.data[0];
      for (var item in obj) {
        this.dtDropDown.push(obj[item][0]);
      }
    });
  }

  rechargHistory(data: any) {
    this.payment.getAllbyCnO(data).subscribe((res: any) => {
      if (res.success == true) this.rechargeList = res.data;
      this.dtTrigger.next();
    });
  }
}
