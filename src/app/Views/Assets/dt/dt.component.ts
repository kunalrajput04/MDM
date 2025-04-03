import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Dt } from 'src/app/Model/dt';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

import Swal from 'sweetalert2';
import { FitBoundsOptions, LatLngBounds,icon, MapOptions, marker, markerClusterGroup, MarkerClusterGroup, MarkerClusterGroupOptions, tileLayer, latLng } from 'leaflet';
declare let $: any;
@Component({
  selector: 'app-dt',
  templateUrl: './dt.component.html',
  styleUrls: ['./dt.component.css'],
})
export class DtComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'DT',
    url: '/mdm/assets/',
  };

  //#endregion
  
  isEdit: boolean = false;
  headerdata = [];
  rowdata = [];
  pageOfItems: Array<any>;
  items = [];
  searchText = null;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  formdata: Dt = new Dt();

  subdivisionDropDown: any[] = [];
  substationDropdown: any[] = [];
  feederDropdown: any[] = [];
  iswritepermission: string;

  
  mapOptions: MapOptions;
  map: any;
  markerClusterOptions: MarkerClusterGroupOptions = {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
    maxClusterRadius: 100
  };
  markerClusterGroup: MarkerClusterGroup;
  markerClusterData = [];
  mapFitToBounds: LatLngBounds;
  mapFitToBoundsOptions: FitBoundsOptions;

  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private dtservice: DTService,
    private router: Router,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feeder: FeederService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    let obj = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,

      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'DT' },

        { extend: 'pdf', title: 'DT' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };
    this.onTableget();
    this.getSubdivision();

    this.iswritepermission = '1';

      
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
    this.mapFitToBoundsOptions = { maxZoom: 5, animate: true };
    this.initializeMapOptions();
  }


  addSubdivionOnMap(data: any) {
    
    this.markerClusterGroup.clearLayers();

    var title =
      '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
      '<b>SUBSTATION NAME :</b> ' +
      data[0] +
      '<br><b>LATITUDE :</b> ' +
      data[4] +
      '<br><b>LONGITUDE :</b> ' +
      data[5] +
      '</div>';
    const newMarker = marker(
      [parseFloat(data[4]), parseFloat(data[5])],
      {
        icon: icon({
          iconSize: [40, 40],
          iconAnchor: [22, 0],
          popupAnchor: [-3, -76],
          iconUrl: '/assets/images/dtimg.png',
        }),
        title: data[0],
      }
    )
      .bindPopup(title);

    this.markerClusterGroup.addLayer(newMarker);

    this.markerClusterGroup.addTo(this.map);

    this.mapFitToBounds = this.markerClusterGroup.getBounds();

  }
  onMapReady(data: any) {
    this.map = data;
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


  onTableget() {
    this.rowdata = [];
    
    this.dtservice.getDtData().subscribe((res: any) => {
    
        
        
        this.headerdata = res.data[0][1];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.rowdata.push(res.data[0][item]);
          }
        }
        //

        this.dtTrigger.next();
      
    });
  }

  // logout() {
  //   this.authservice.logout();
  //   sessionStorage.removeItem('IsReload');
  //   this.router.navigate(['/login']);
  // }

  rerender(): void {
    this.onTableget();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  openAddModel() {
    this.isEdit = false;
    this.formdata;
    this.getSubdivision();
  }
  getSubdivision() {
    

    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
     
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }

        
        
      
    });
  }
  getSubstation(subdivision: string) {
    
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
       
          
          
          this.substationDropdown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.substationDropdown.push(obj[item][0]);
            }
           
          }
       
      });
  }
  getFeeder(substation: string) {
    
    this.feeder.getFeederBySubstation(substation).subscribe((res: any) => {
      
      this.feederDropdown = [];
      if (res.data != null) {
        if (
          res != null &&
          res.message != 'Key Is Not Valid' &&
          res.message != 'Session Is Expired'
        ) {
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropdown.push(obj[item][0]);
          }
          
        }
      }
    });
  }
  getDTInfo(data: any) {
    this.isEdit = true;
    this.getSubdivision();
    this.formdata = {
      latitude: data[5],
      longitude: data[4],
      subDivisionName: data[2],
      subStationName: data[1],
      ownerName: localStorage.getItem('HesUserID'),
      feederName: data[3],
      dtName: data[0],
    };
  }
  onSubmit(form: NgForm) {
    $('#ModalAddDT').modal('hide');
    
    this.dtservice.addDT(form.value).subscribe((res: any) => {
      if (res != null) {
       
          
          this.rerender();
          if (this.isEdit) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.success('Created Successfully');
          }
          
        
      }
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }
  deleteDTInfo(dtname: string) {
    this.formdata.dtName = dtname;
    Swal.fire({
      title: 'Are you sure?',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },

      text: 'You will not be able to recover this data! Enter your reason',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value == '') {
        Swal.fire('Please Enter Delete Reason!', '', 'error');
      } else if (result.isConfirmed) {
        this.dtservice.deleteDTData(this.formdata).subscribe((res: any) => {
          if (res != null) {

            
              this.formdata;
              Swal.fire('deleted successfully', '', 'success');
              
              this.rerender();
          
            
          }
        });
      }
    });
  }
}
