import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IFeederData,
  IRevenueResponse,
  ISubstationData,
} from 'src/app/Model/irevenue-response';
import { MeterData } from 'src/app/Model/meter-data';
import { DatePipe } from '@angular/common';
import { RevenueService } from 'src/app/Service/revenue.service';

import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { DTService } from 'src/app/Service/dt.service';
import {
  FitBoundsOptions,
  icon,
  latLng,
  LatLngBounds,
  MapOptions,
  marker,
  markerClusterGroup,
  MarkerClusterGroup,
  MarkerClusterGroupOptions,
  tileLayer,
} from 'leaflet';
import { DataService } from 'src/app/Service/data.service';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/Shared/chartoptions';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { AccessLevel } from 'src/app/Model/access-level';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css'],
  providers: [RevenueService],
})
export class RevenueComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Revenue',
    url: '/mdm/revenue/',
  };

  //#endregion

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  dropdownEnabled = true;
  treeData: IRevenueResponse[] = [];
  subtationtreeData: ISubstationData[] = [];
  feedertreeData: IFeederData[] = [];
  dttreeData: string[] = [];
  accessLevel: string = localStorage.getItem('AccessLevel');
  formdata: MeterData = new MeterData();
  formData: AccessLevel = {
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
    accessLevel: '',
  };

  accessValue: string = localStorage.getItem('AccessValue');
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  markerClusterData = [];
  map: any;
  markerClusterOptions: MarkerClusterGroupOptions = {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
  };
  mapOptions: MapOptions;
  markerClusterGroup: MarkerClusterGroup;
  mapFitToBounds: LatLngBounds;
  mapFitToBoundsOptions: FitBoundsOptions;

  deviceSrNo: string[] = [];
  consumerno: string[] = [];
  ipv6: string[] = [];
  loadstatus: string[] = [];
  lattitude: string[] = [];
  longitude: string[] = [];
  deviceType: string[] = [];
  ccmsstatus: string[] = [];
  consumer: string[] = [];
  subdivision: string[] = [];
  feeder: string[] = [];
  substationdata: string[] = [];
  dt: string[] = [];
  gprs: string[] = [];
  planes: string[] = [];

  constructor(
    private service: RevenueService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private data: DataService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.chartOptions = {
      pieseries: [500, 300, 200],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Total Amount', 'Paid Amount', 'Due Amount'],

      dataLabels: {
        enabled: true,
        formatter: function (val, index) {
          return val.toString();
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.RevenueTreeData();
    this.markerClusterGroup = markerClusterGroup({
      removeOutsideVisibleBounds: true,
    });
    this.mapFitToBoundsOptions = { maxZoom: 12, animate: true };
    this.initializeMapOptions();
    this.getDataMap();
  }
  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(28.7041, 77.1025),
      zoom: 9,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }
  RevenueTreeData() {
    this.service.getRevenueTree().subscribe(
      (res: any) => {
        if (res.data != null) {
          if (this.accessLevel == 'SUBDEVISION') {
            this.treeData = res.data;
          } else if (this.accessLevel == 'SUBSTATION') {
            this.subtationtreeData = res.data;
          } else if (this.accessLevel == 'FEEDER') {
            this.feedertreeData = res.data;
          } else if (this.accessLevel == 'DT') {
            this.dttreeData = res.data;
          }
          console.clear();
          console.log(res.data);
        }
      },
      (err) => {}
    );
  }

  onMapReady(data: any) {
    this.map = data;
  }

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
  }
  getSubdivision() {
    if (this.accessLevel == 'All') {
      this.subdivisionservice.getSubdivision().subscribe((res: any) => {
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      });
    } else if (this.accessLevel == 'SUBDEVISION') {
      this.substation
        .getSubstationBySubdivision(this.accessValue)
        .subscribe((res: any) => {
          this.substatioDropDown = [];

          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
        });
    } else if (this.accessLevel == 'SUBSTATION') {
      this.feederservice
        .getFeederBySubstation(this.accessValue)
        .subscribe((res: any) => {
          this.feederDropDown = [];

          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        });
    } else if (this.accessLevel == 'FEEDER') {
      this.dtservice.getDTByFeeder(this.accessValue).subscribe((res: any) => {
        this.dtDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      });
    }
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
    this.feederservice
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        this.feederDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.feederDropDown.push(obj[item][0]);
        }
      });
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

  getDataMap() {
    this.data.getMapDataForRevenue().subscribe((res: any) => {
      if (
        res != null &&
        res.message != 'Key Is Not Valid' &&
        res.message != 'Session Is Expired'
      ) {
        this.deviceSrNo = res.data['DEVICE'];
        this.consumerno = res.data['CRN'];
        this.ipv6 = res.data['NICIP'];
        this.loadstatus = res.data['METERTYPE'];
        this.lattitude = res.data['LATITUDE'];
        this.longitude = res.data['LONGITUDE'];
        this.deviceType = res.data['DEVICE_TYPE'];
        this.ccmsstatus = res.data['STATUS'];
        this.consumer = res.data['CONSUMER_NAME'];
        this.subdivision = res.data['SUBDIVISION'];
        this.feeder = res.data['FEEDER'];
        this.substation = res.data['SUBSTATION'];
        this.dt = res.data['DT'];

        //this.setDataForSubdivision();
        this.setMapData();
      }
    });
  }

  setMapData() {
    for (let i = 0; i < 10000; i++) {
      if (this.deviceSrNo[i] != 'null') {
        if (this.deviceType[i] == 'METER') {
          if (this.longitude[i] != 'null') {
            let title =
              '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
              '<b>CONSUMER NUMBER :</b>' +
              this.consumerno[i] +
              '<br><b>CONSUMER NAME :</b>' +
              this.consumer[i] +
              '<br><b>METER S.NO :</b> ' +
              this.deviceSrNo[i] +
              '<br><b>NIC TYPE :</b> ' +
              this.gprs +
              '<br><b>NIC IPV6 :</b>' +
              this.ipv6[i] +
              '<br><b>LOAD STATUS :</b>' +
              this.loadstatus[i] +
              '<br><b>STATUS :</b>' +
              this.ccmsstatus[i] +
              '<br><b>SUBDIVISION :</b>' +
              this.subdivision[i] +
              '<br><b>SUBSTATION :</b>' +
              this.substation[i] +
              '<br><b>FEEDER :</b>' +
              this.feeder[i] +
              '<br><b>DT :</b>' +
              this.dt[i] +
              '<br><b>LATITUDE :</b> ' +
              this.lattitude[i] +
              '<br><b>LONGITUDE :</b> ' +
              this.longitude[i] +
              '</div>';
            const newMarker = marker(
              [parseFloat(this.lattitude[i]), parseFloat(this.longitude[i])],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: '/assets/images/deviceimg.png',
                }),
              }
            ).bindPopup(title);
            // this.markerClusterGroup = markerClusterGroup({

            // });
            newMarker.bindTooltip('₹0', {
              direction: 'right',
              permanent: true,
              sticky: true,

              opacity: 0.75,
              className: 'leaflet-tooltip-own',
            });
            this.markerClusterGroup.addLayer(newMarker);
          }
        } else if (this.deviceType[i] == 'SUBDIVISION') {
          if (this.longitude[i] != 'null') {
            var title =
              '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
              '<b>' +
              this.deviceType[i] +
              ' NAME :</b> ' +
              this.deviceSrNo[i] +
              '<br><b>LATITUDE :</b> ' +
              this.lattitude[i] +
              '<br><b>LONGITUDE :</b> ' +
              this.longitude[i] +
              '</div>';
            const newMarker = marker(
              [parseFloat(this.lattitude[i]), parseFloat(this.longitude[i])],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: '/assets/images/subdivisionimg.png',
                }),
              }
            ).bindPopup(title);
            newMarker.bindTooltip('₹0', {
              direction: 'right',
              permanent: true,
              sticky: true,

              opacity: 0.75,
              className: 'leaflet-tooltip-own',
            });
            this.markerClusterGroup.addLayer(newMarker);
          }
        } else if (this.deviceType[i] == 'FEEDER') {
          if (this.longitude[i] != 'null') {
            var title =
              '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
              '<b>' +
              this.deviceType[i] +
              ' NAME :</b> ' +
              this.deviceSrNo[i] +
              '<br><b>LATITUDE :</b> ' +
              this.lattitude[i] +
              '<br><b>LONGITUDE :</b> ' +
              this.longitude[i] +
              '</div>';
            const newMarker = marker(
              [parseFloat(this.lattitude[i]), parseFloat(this.longitude[i])],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: '/assets/images/feederimg.png',
                }),
              }
            ).bindPopup(title);
            newMarker.bindTooltip('₹0', {
              direction: 'right',
              permanent: true,
              sticky: true,

              opacity: 0.75,
              className: 'leaflet-tooltip-own',
            });
            this.markerClusterGroup.addLayer(newMarker);
          }
        } else if (this.deviceType[i] == 'SUBSTATION') {
          if (this.longitude[i] != 'null') {
            var title =
              '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
              '<b>' +
              this.deviceType[i] +
              ' NAME :</b> ' +
              this.deviceSrNo[i] +
              '<br><b>LATITUDE :</b> ' +
              this.lattitude[i] +
              '<br><b>LONGITUDE :</b> ' +
              this.longitude[i] +
              '</div>';
            const newMarker = marker(
              [parseFloat(this.lattitude[i]), parseFloat(this.longitude[i])],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: '/assets/images/substationimg.png',
                }),
              }
            ).bindPopup(title);
            newMarker.bindTooltip('₹0', {
              direction: 'right',
              permanent: true,
              sticky: true,

              opacity: 0.75,
              className: 'leaflet-tooltip-own',
            });
            this.markerClusterGroup.addLayer(newMarker);
          }
        } else if (this.deviceType[i] == 'DT') {
          if (this.longitude[i] != 'null') {
            var title =
              '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
              '<b>' +
              this.deviceType[i] +
              ' NAME :</b> ' +
              this.deviceSrNo[i] +
              '<br><b>LATITUDE :</b> ' +
              this.lattitude[i] +
              '<br><b>LONGITUDE :</b> ' +
              this.longitude[i] +
              '</div>';
            const newMarker = marker(
              [parseFloat(this.lattitude[i]), parseFloat(this.longitude[i])],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: '/assets/images/deviceimg.png',
                }),
              }
            ).bindPopup(title);

            newMarker.bindTooltip('₹0', {
              direction: 'right',
              permanent: true,
              sticky: true,

              opacity: 0.75,
              className: 'leaflet-tooltip-own',
            });
            this.markerClusterGroup.addLayer(newMarker);
          }
        }
      }
    }

    this.markerClusterGroup.addTo(this.map);
    this.mapFitToBounds = this.markerClusterGroup.getBounds();
  }
}
