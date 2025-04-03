import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerInformation, MeterData, MeterInfomation } from 'src/app/Model/meter-data';
import { DataService } from 'src/app/Service/data.service';
import { icon, latLng, Layer, MapOptions, marker, tileLayer } from 'leaflet';
import { DeviceInformation, getDevice } from 'src/app/Model/device-information';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { DTService } from 'src/app/Service/dt.service';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
@Component({
  selector: 'app-consumer-info-view',
  templateUrl: './consumer-info-view.component.html',
  styleUrls: ['./consumer-info-view.component.css']
})
export class ConsumerInfoViewComponent implements OnInit {
  consumerformdata: ConsumerMeterInfo;
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
  @ViewChild('closebutton') closebutton;
  constructor(
    private service: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,

    private router: Router,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feeder: FeederService,
    private dtservice: DTService,
  ) { }

  ngOnInit(): void {
    this.initializeMapOptions();
    this.getSubdivision();
  }

  onSubmit() {
    

    this.service.getDeviceInfo(this.formdata).subscribe((res: any) => {
      
      
      if (res.data != null) {
        this.isData = true;
        this.iserror = false;
        this.consumerformdata.ownerName = res.data.owner_name;
        this.consumerformdata.subDivisionName = res.data.subdevision_name;
        this.getSubstation(this.consumerformdata.subDivisionName);
        this.consumerformdata.subStationName = res.data.substation_name;
        this.getFeeder(this.consumerformdata.subStationName);
        this.consumerformdata.feederName = res.data.feeder_name;
        this.getDT(this.consumerformdata.feederName);

        this.consumerformdata.dtName = res.data.dt_name;
        this.consumerformdata.deviceSerialNo = this.formdata.deviceNo;
        this.consumerformdata.commissioningStatus = res.data.commissioning_status;
        this.consumerformdata.consumerName = res.data.consumer_name;
        this.consumerformdata.consumerNo = res.data.consumer_no;
        this.consumerformdata.phoneNumber = res.data.phone_number;
        this.consumerformdata.latitude = res.data.latitude;
        this.consumerformdata.longitude = res.data.longitude;
        this.consumerformdata.deviceType = res.data.device_type;
        this.consumerformdata.ipAddressMain = res.data.ip_address_main;
        this.consumerformdata.address = res.data.address;
        this.consumerformdata.ipPortMain = res.data.ip_port_main;
        this.consumerformdata.manufacturer = res.data.manufacturer;

        if (this.consumerformdata.latitude != "--" && this.consumerformdata.latitude != '0' && this.consumerformdata.latitude != 'null') {
          this.isLatLongExists = true;
          
          const newMarker = marker(
            [parseFloat(this.consumerformdata.latitude), parseFloat(this.consumerformdata.longitude)],
            {
              icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: '/assets/images/usermapicon.png',

              })
            }
          );
          this.markers.push(newMarker);

          this.mapOptions = {
            center: latLng(parseFloat(this.consumerformdata.latitude), parseFloat(this.consumerformdata.longitude)),
            zoom: 9,
            layers: [
              tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                  maxZoom: 18,
                  attribution: 'Map data © OpenStreetMap contributors'
                })
            ],

          };

        }
        else {
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
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: 'Map data © OpenStreetMap contributors'
          })
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
    
    this.feeder
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        
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
      this.service.AddDevice(form.value).subscribe((res: any) => {
        if (res != null) {
          if (res.data == true) {
            if (this.isEdit) {
              
              this.toastr.success('Updated Successfully');
              // this.rerender();
            } else {
              
              //this.rerender();
              this.toastr.success('Created Successfully');
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
}
