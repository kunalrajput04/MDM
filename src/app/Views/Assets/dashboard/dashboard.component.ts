import { Component, OnInit } from '@angular/core';
import {
  FitBoundsOptions,
  icon,
  latLng,
  LatLngBounds,
  Layer,
  MapOptions,
  marker,
  MarkerClusterGroup,
  markerClusterGroup,
  MarkerClusterGroupOptions,
  Point,
  polygon,
  polyline,
  Polyline,
  tileLayer,
} from 'leaflet';
import 'leaflet-arc';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
declare let L;
export class Dashboard {
  OWNER: string = '';
  SUBDEVISION: number = 0;
  FEEDER: number = 0;
  SUBSTATION: number = 0;
  DT: number = 0;
  DCU: number = 0;
  DEVICES: number = 0;
}

declare const GetMap: any;
export interface ILevel {
  levelType: string;
  subDivisionName: string;
  subStationName: string;
  feederName: string;
  dtName: string;
}

export interface TableData {
  name: string;
  lat: string;
  long: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Dashboard',
    url: '/mdm/assets/',
  };

  //#endregion
  mapOptions: MapOptions;

  map: any;
  markerClusterOptions: MarkerClusterGroupOptions = {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
    maxClusterRadius: 100,
  };
  markerClusterGroup: MarkerClusterGroup;
  markerClusterData = [];

  mapFitToBounds: LatLngBounds;
  mapFitToBoundsOptions: FitBoundsOptions;
  subdivisionData: any[] = [];
  substationData: any[] = [];
  feederData: any[] = [];
  dtData: any[] = [];

  substationMarker: any[] = [];
  feederMarker: any[] = [];
  dtMarker: any[] = [];
  deviceMarker: any[] = [];

  polylineSubstationData: Polyline;
  polylineFeederData: Polyline;
  polylineDTData: Polyline;
  polylineDeviceData: Polyline;
  dashboard: Dashboard = new Dashboard();

  gridColumnApi: any;

  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;

  //Subdivision Table Options
  gridApi: any;

  //Subdivision Table Options

  //Substation Table Options
  subgridColumnApi: any;

  subgridApi: any;
  //Substation Table Options

  //Feeder Table Options
  feedergridColumnApi: any;

  feedergridApi: any;
  //Feeder Table Options

  //Dt Table Options
  dtgridColumnApi: any;
  dtgridApi: any;
  //DT Table Options

  subdivisontableData: TableData[] = [];
  substationtableData: TableData[] = [];
  feedertableData: TableData[] = [];
  dttableData: TableData[] = [];

  rowSelection: 'single' | 'multiple' = 'single';
  checkName: string = '';
  constructor(
    private spinner: NgxSpinnerService,
    private data: DataService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } };

    this.defaultColDef = { resizable: true, filter: true, sortable: true };

    this.columnDefs = [
      { field: 'name' },
      { field: 'lat', width: 40 },
      { field: 'long', width: 40 },
    ];
  }

  ngOnInit(): void {
    this.getDashboardCount();
    this.markerClusterGroup = markerClusterGroup({
      removeOutsideVisibleBounds: true,
      spiderfyOnMaxZoom: true,
      singleMarkerMode: false,
      animate: true,
      animateAddingMarkers: true,
      spiderLegPolylineOptions: {
        color: '#426cf5',
      },
      spiderfyDistanceMultiplier: 2,
      chunkedLoading: true,
    });
    this.mapFitToBoundsOptions = { maxZoom: 12, animate: true };
    this.initializeMapOptions();
    this.getSubdivision();
  }
  onMapReady(data: any) {
    this.map = data;
  }

  onSubdivisionSelected(params: any) {
    if (this.checkName != params.data.name) {
      this.addSubdivionOnMap(params.data);

      this.checkName = params.data.name;
      setTimeout(function () {}, 1000);
      this.subgridApi.setRowData([]);
      this.substationtableData = [];

      this.dtgridApi.setRowData([]);
      this.dttableData = [];

      this.feedergridApi.setRowData([]);
      this.feedertableData = [];

      this.substation
        .getSubstationDataForMap(params.data.name)
        .subscribe((res: any) => {
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.substationtableData.push({
                  name: res.data[0][item][1],
                  lat: res.data[0][item][2],
                  long: res.data[0][item][3],
                });
              }
            }

            this.subgridApi.setRowData(this.substationtableData);
            this.subgridColumnApi.autoSizeAllColumns();
          }
        });
    }
  }

  addSubdivionOnMap(data: any) {
    this.markerClusterGroup.clearLayers();

    var title =
      '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
      '<b>SUBDIVISION NAME :</b> ' +
      data.name +
      '<br><b>LATITUDE :</b> ' +
      data.lat +
      '<br><b>LONGITUDE :</b> ' +
      data.long +
      '</div>';
    const newMarker = marker([parseFloat(data.lat), parseFloat(data.long)], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [22, 0],
        popupAnchor: [-3, -76],
        iconUrl: '/assets/images/subdivisionimg.png',
      }),
      title: data.name,
    })
      .on('dblclick', this.checkSubdivisionData.bind(this))
      .bindPopup(title);

    this.markerClusterGroup.addLayer(newMarker);

    this.markerClusterGroup.addTo(this.map);

    this.mapFitToBounds = this.markerClusterGroup.getBounds();
    this.map.fitBounds(this.markerClusterGroup.getBounds());
  }

  onSubstationSelected(params: any) {
    if (this.checkName != params.data.name) {
      this.checkName = params.data.name;
      this.feedergridApi.setRowData([]);
      this.feedertableData = [];

      this.dtgridApi.setRowData([]);
      this.dttableData = [];

      this.feederservice
        .getFeederListForMap(params.data.name)
        .subscribe((res: any) => {
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.feedertableData.push({
                  name: res.data[0][item][2],
                  lat: res.data[0][item][3],
                  long: res.data[0][item][4],
                });
              }
            }

            this.feedergridApi.setRowData(this.feedertableData);
            this.feedergridColumnApi.autoSizeAllColumns();
          }
        });
    }
  }

  onFeederSelected(params: any) {
    if (this.checkName != params.data.name) {
      this.checkName = params.data.name;
      this.dtgridApi.setRowData([]);
      this.dttableData = [];
      this.dtservice.getDtDataForMap(params.data.name).subscribe((res: any) => {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.dttableData.push({
                name: res.data[0][item][0],
                lat: res.data[0][item][4],
                long: res.data[0][item][5],
              });
            }
          }

          this.dtgridApi.setRowData(this.dttableData);
          this.dtgridColumnApi.autoSizeAllColumns();
        }
      });
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.subdivisionservice.getAllSubDivisioin().subscribe((res: any) => {
      console.log(res);

      for (let item in res.data[0]) {
        if (parseInt(item) !== 1) {
          this.subdivisontableData.push({
            name: res.data[0][item][0],
            lat: res.data[0][item][1],
            long: res.data[0][item][2],
          });
        }
      }
      params.api.setRowData(this.subdivisontableData);

      this.gridColumnApi.autoSizeAllColumns();
    });
  }

  onGridReady1(params) {
    this.subgridApi = params.api;
    this.subgridColumnApi = params.columnApi;
    params.api.setRowData(this.substationtableData);
  }
  onGridReady2(params) {
    this.feedergridApi = params.api;
    this.feedergridColumnApi = params.columnApi;
    params.api.setRowData(this.feedertableData);
  }
  onGridReady3(params) {
    this.dtgridApi = params.api;
    this.dtgridColumnApi = params.columnApi;
    params.api.setRowData(this.dttableData);
  }
  getDashboardCount() {
    this.data.getDashboard().subscribe((res: any) => {
      this.dashboard = res.data;
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

  checkSubdivisionData(data: any) {
    let obj = this.subdivisionData.find(
      (o) => o.title === data.target.options.title
    );

    let d = obj.title;
    let lt = obj.lat;
    let lg = obj.lng;

    if (this.substationMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.substationMarker);

      this.substationData = [];
      this.polylineSubstationData.remove();
    }
    if (this.feederMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.feederMarker);
      this.polylineFeederData.remove();
      this.feederData = [];
    }
    if (this.dtMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.dtMarker);
      this.polylineDTData.remove();
      this.dtData = [];
    }
    if (this.deviceMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.deviceMarker);
      this.polylineDeviceData.remove();
    }

    this.getSubstation(d, lt, lg);
  }

  checkSubstationData(data: any) {
    let obj = this.substationData.find(
      (o) => o.title === data.target.options.title
    );
    let d = obj.title;
    let lt = obj.lat;
    let lg = obj.lng;

    if (this.feederMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.feederMarker);
      this.polylineFeederData.remove();
      this.feederData = [];
    }
    if (this.dtMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.dtMarker);
      this.polylineDTData.remove();
      this.dtData = [];
    }
    if (this.deviceMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.deviceMarker);
      this.polylineDeviceData.remove();
    }
    this.getFeeder(d, lt, lg);
  }
  checkFeederData(data: any) {
    let obj = this.feederData.find(
      (o) => o.title === data.target.options.title
    );
    let d = obj.title;
    let lt = obj.lat;
    let lg = obj.lng;

    if (this.dtMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.dtMarker);
      this.polylineDTData.remove();
      this.dtData = [];
    }
    if (this.deviceMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.deviceMarker);
      this.polylineDeviceData.remove();
    }
    this.getDT(d, lt, lg);
  }
  checkDTData(data: any) {
    let obj = this.dtData.find((o) => o.title === data.target.options.title);
    let d = obj.title;
    let lt = obj.lat;
    let lg = obj.lng;

    if (this.deviceMarker.length > 0) {
      this.markerClusterGroup.removeLayers(this.deviceMarker);
      this.polylineDeviceData.remove();
    }
    this.getDevice(d, lt, lg);
  }

  getSubdivision() {
    this.subdivisionData = [];
    this.subdivisionservice.getAllSubDivisioin().subscribe((res: any) => {
      let obj = res.data[0];
      for (var item in obj) {
        if (parseInt(item) !== 1) {
          let bindData = {
            title: obj[item][0],
            lat: obj[item][1],
            lng: obj[item][2],
          };
          this.subdivisionData.push(bindData);
        }
      }
    });
  }
  getSubstation(data: string, lat: number, long: number) {
    let IsDataAvilable = false;

    this.substation.getSubstationDataForMap(data).subscribe((res: any) => {
      let latlngs: [number, number][] = [[lat, long]];

      if (res.data != null) {
        let obj = res.data[0];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            Math.trunc(obj[item][1]) == 25;
            {
              IsDataAvilable = true;
              let bindData = {
                title: obj[item][1],
                lat: obj[item][2],
                lng: obj[item][3],
              };
              this.substationData.push(bindData);
              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                '<b>SUBSTATION NAME :</b> ' +
                obj[item][1] +
                '<br><b>LATITUDE :</b> ' +
                obj[item][2] +
                '<br><b>LONGITUDE :</b> ' +
                obj[item][3] +
                '</div>';
              const newMarker = marker(
                [parseFloat(obj[item][2]), parseFloat(obj[item][3])],
                {
                  icon: icon({
                    iconSize: [40, 40],
                    iconAnchor: [22, 0],
                    popupAnchor: [-3, -76],
                    iconUrl: '/assets/images/substationimg.png',
                  }),
                  title: obj[item][1],
                }
              )
                .on('dblclick', this.checkSubstationData.bind(this))
                .bindPopup(title);

              latlngs.push([
                parseFloat(obj[item][2]),
                parseFloat(obj[item][3]),
              ]);

              this.polylineSubstationData = polyline(latlngs, {
                color: 'blue',
              });

              this.substationMarker.push(newMarker);
              this.markerClusterGroup.addLayer(newMarker);
            }
          }
        }

        this.markerClusterGroup.addTo(this.map);
        if (IsDataAvilable) this.polylineSubstationData.addTo(this.map);
        this.mapFitToBounds = this.polylineSubstationData.getBounds();
        this.map.fitBounds(this.markerClusterGroup.getBounds());
      }
    });
  }

  getFeeder(data: string, lat: number, long: number) {
    let IsDataAvilable = false;

    this.feederservice.getFeederListForMap(data).subscribe((res: any) => {
      var latlngs: [number, number][] = [[lat, long]];

      if (res.data != null) {
        let obj = res.data[0];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            Math.trunc(obj[item][1]) == 25;
            {
              IsDataAvilable = true;
              let bindData = {
                title: obj[item][2],
                lat: obj[item][3],
                lng: obj[item][4],
              };
              this.feederData.push(bindData);
              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                '<b>FEEDER NAME :</b> ' +
                obj[item][2] +
                '<br><b>LATITUDE :</b> ' +
                obj[item][3] +
                '<br><b>LONGITUDE :</b> ' +
                obj[item][4] +
                '</div>';
              const newMarker = marker(
                [parseFloat(obj[item][3]), parseFloat(obj[item][4])],
                {
                  icon: icon({
                    iconSize: [40, 40],
                    iconAnchor: [22, 0],
                    popupAnchor: [-3, -76],
                    iconUrl: '/assets/images/feederimg.png',
                  }),
                  title: obj[item][2],
                }
              )
                .on('dblclick', this.checkFeederData.bind(this))
                .bindPopup(title);

              latlngs.push([
                parseFloat(obj[item][3]),
                parseFloat(obj[item][4]),
              ]);
              this.polylineFeederData = polyline(latlngs, { color: 'yellow' });
              this.feederMarker.push(newMarker);
              this.markerClusterGroup.addLayer(newMarker);
            }
          }
        }
        this.markerClusterGroup.addTo(this.map);
        if (IsDataAvilable) this.polylineFeederData.addTo(this.map);
        this.mapFitToBounds = this.polylineFeederData.getBounds();
        this.map.fitBounds(this.markerClusterGroup.getBounds());
      }
    });
  }
  getDT(data: string, lat: number, long: number) {
    let IsDataAvilable = false;

    this.dtservice.getDtDataForMap(data).subscribe((res: any) => {
      var latlngs: [number, number][] = [[lat, long]];

      if (res.data != null) {
        let obj = res.data[0];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            Math.trunc(obj[item][1]) == 25;
            {
              IsDataAvilable = true;
              let bindData = {
                title: obj[item][0],
                lat: obj[item][4],
                lng: obj[item][5],
              };
              this.dtData.push(bindData);
              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                '<b>DT NAME :</b> ' +
                obj[item][0] +
                '<br><b>LATITUDE :</b> ' +
                obj[item][4] +
                '<br><b>LONGITUDE :</b> ' +
                obj[item][5] +
                '</div>';
              const newMarker = marker(
                [parseFloat(obj[item][4]), parseFloat(obj[item][5])],
                {
                  icon: icon({
                    iconSize: [40, 40],
                    iconAnchor: [22, 0],
                    popupAnchor: [-3, -76],
                    iconUrl: '/assets/images/dtimg.png',
                  }),
                  title: obj[item][0],
                }
              )
                .on('dblclick', this.checkDTData.bind(this))
                .bindPopup(title);

              latlngs.push([
                parseFloat(obj[item][4]),
                parseFloat(obj[item][5]),
              ]);
              this.polylineDTData = polyline(latlngs, { color: 'orange' });
              this.dtMarker.push(newMarker);
              this.markerClusterGroup.addLayer(newMarker);
            }
          }
        }
        this.markerClusterGroup.addTo(this.map);
        if (IsDataAvilable) this.polylineDTData.addTo(this.map);
        this.mapFitToBounds = this.polylineDTData.getBounds();
        this.map.fitBounds(this.markerClusterGroup.getBounds());
      }
    });
  }
  getDevice(data: string, lat: number, long: number) {
    let IsDataAvilable = false;

    this.data.getDeviceListForMap(data).subscribe((res: any) => {
      var latlngs: [number, number][] = [[lat, long]];

      if (res.data != null) {
        let obj = res.data[0];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            Math.trunc(obj[item][1]) == 25;
            {
              IsDataAvilable = true;
              var title =
                '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
                '<b>CONSUMER NUMBER :</b>' +
                obj[item][2] +
                '<br><b>CONSUMER NAME :</b>' +
                obj[item][0] +
                '<br><b>METER S.NO :</b> ' +
                obj[item][1] +
                '<br><b>NIC TYPE :</b> GPRS' +
                '<br><b>NIC IPV6 :</b>' +
                obj[item][8] +
                '<br><b>SUBDIVISION :</b>' +
                obj[item][4] +
                '<br><b>SUBSTATION :</b>' +
                obj[item][5] +
                '<br><b>FEEDER :</b>' +
                obj[item][6] +
                '<br><b>LATITUDE :</b> ' +
                obj[item][9] +
                '<br><b>LONGITUDE :</b> ' +
                obj[item][10] +
                '</div>';
              const newMarker = marker(
                [parseFloat(obj[item][9]), parseFloat(obj[item][10])],
                {
                  icon: icon({
                    iconSize: [40, 40],
                    iconAnchor: [22, 0],
                    popupAnchor: [-3, -76],
                    iconUrl: '/assets/images/deviceimg.png',
                  }),
                  title: obj[item][1],
                }
              ).bindPopup(title);
              latlngs.push([
                parseFloat(obj[item][9]),
                parseFloat(obj[item][10]),
              ]);
              this.polylineDeviceData = polyline(latlngs, { color: 'green' });
              this.deviceMarker.push(newMarker);
              this.markerClusterGroup.addLayer(newMarker);
            }
          }
        }
        this.markerClusterGroup.addTo(this.map);
        if (IsDataAvilable) this.polylineDeviceData.addTo(this.map);
        this.mapFitToBounds = this.polylineDeviceData.getBounds();
        this.map.fitBounds(this.markerClusterGroup.getBounds());
      }
    });
  }
}
