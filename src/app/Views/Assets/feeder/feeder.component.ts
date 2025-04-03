import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Feeder } from 'src/app/Model/feeder';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { Dropdown } from 'src/app/Model/smart-meter';
import { AuthService } from 'src/app/Service/auth.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

import Swal from 'sweetalert2';
import { FitBoundsOptions, LatLngBounds,icon, MapOptions, marker, markerClusterGroup, MarkerClusterGroup, MarkerClusterGroupOptions, tileLayer, latLng } from 'leaflet';
declare let $: any;

@Component({
  selector: 'app-feeder',
  templateUrl: './feeder.component.html',
  styleUrls: ['./feeder.component.css'],
})
export class FeederComponent implements OnInit {
  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Feeder',
    url: '/mdm/assets/',
  };

  //#endregion
  formdata: Feeder = new Feeder();
  // formdata: Feeder = {
  //   user_id: '',
  // subdivisionName: '',
  // substationName: '',
  // latitude: '',
  // longitude: '',
  // feeder_name: ''
  // }
  
  subdivisionDropDown: Dropdown[] = [];
  substationDropdown: Dropdown[] = [];
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
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private feederservice: FeederService,
    private router: Router,
    private substation: SubstationService,
    private subdivisionservice: SubdivisionService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.data);
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
        { extend: 'excel', title: 'Feeder' },

        { extend: 'pdf', title: 'Feeder' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };
    this.getFeeder();
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
      data[2] +
      '<br><b>LATITUDE :</b> ' +
      data[3] +
      '<br><b>LONGITUDE :</b> ' +
      data[4] +
      '</div>';
    const newMarker = marker(
      [parseFloat(data[3]), parseFloat(data[4])],
      {
        icon: icon({
          iconSize: [40, 40],
          iconAnchor: [22, 0],
          popupAnchor: [-3, -76],
          iconUrl: '/assets/images/feederimg.png',
        }),
        title: data[2],
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


  addFeeder() {
    $('#ModalAddFeeder').modal('show');
    this.getSubdivision();
    this.formdata = new Feeder();
    this.isEdit = false;
  }

  saveFeeder(form: NgForm) {
    
    console.log(form.value);
    this.feederservice.addFeeder(form.value).subscribe((res: any) => {
      if (res.data == true) {
        
          if (this.isEdit) {
            
            this.toaster.success('Record Saved Successfully');
            $('#ModalAddFeeder').modal('hide');
            
            this.rerender();
          } else if (res.data == null) {
            
          } else {
            
            this.toaster.success('Record Updated Successfully');
            $('#ModalAddFeeder').modal('hide');
            
            this.rerender();
          }
        
      } else {
        
        this.toaster.error('Oops! Something Went wrong');
        $('#ModalAddFeeder').modal('hide');
      }
      this.isEdit = false;
    });
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
    // this.subdivisionDropDown = [];
    
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

  getFeeder() {
    
    this.feederservice.getFeederList().subscribe((res: any) => {
      
     
        this.rowdata = [];
        this.headerdata = res.data[0][1];

        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.rowdata.push(res.data[0][item]);
          }
        }
        
        this.dtTrigger.next();
      
    });
  }

  // logout() {
  //   this.authservice.logout();
  //   sessionStorage.removeItem('IsReload');
  //   this.router.navigate(['/login']);
  // }

  rerender(): void {
    this.getFeeder();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  getFeederInfo(data: any) {
    
    this.isEdit = true;
    this.getSubdivision();
    this.getSubstation(data[0]);

    this.formdata = {
      subdivisionName: data[0],
      substationName: data[1],
      feeder_name: data[2],
      latitude: data[3],
      longitude: data[4],
      user_id: localStorage.getItem('HesUserID'),
    };
  }

  deleteFederInfo(feerderId: string) {
    this.formdata.feeder_name = feerderId;
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
        this.feederservice.deleteFeeder(this.formdata).subscribe((res: any) => {
          if (res != null) {
           
              this.formdata = new Feeder();
              Swal.fire('deleted successfully', '', 'success');
              
              this.rerender();
          
          }
        });
      }
    });
  }
}
