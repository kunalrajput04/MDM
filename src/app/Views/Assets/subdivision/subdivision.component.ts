import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { FitBoundsOptions, latLng, icon, LatLngBounds, MapOptions, marker, markerClusterGroup, MarkerClusterGroup, MarkerClusterGroupOptions, tileLayer } from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { Subdivision } from 'src/app/Model/subdivision';
import { AuthService } from 'src/app/Service/auth.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';

import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-subdivision',
  templateUrl: './subdivision.component.html',
  styleUrls: ['./subdivision.component.css'],
})
export class SubdivisionComponent implements OnInit {


  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Subdivision',
    url: '/mdm/assets/',
  };
  
  //#endregion
  formdata: Subdivision = new Subdivision();
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
  @ViewChild('myModal') myModal;


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
    private subdivision: SubdivisionService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
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
        { extend: 'excel', title: 'Subdivision' },

        { extend: 'pdf', title: 'Subdivision' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };

    this.getSubDivision();
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

  addSubDivision() {
    //$('#ModalAddSubdivision').modal('show');
    this.myModal.nativeElement.className = 'show';
    this.isEdit = false;
    this.formdata = new Subdivision();
  }

  addSubdivionOnMap(data: any) {
    
    this.markerClusterGroup.clearLayers();

    var title =
      '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
      '<b>SUBDIVISION NAME :</b> ' +
      data[0] +
      '<br><b>LATITUDE :</b> ' +
      data[1] +
      '<br><b>LONGITUDE :</b> ' +
      data[2] +
      '</div>';
    const newMarker = marker(
      [parseFloat(data[1]), parseFloat(data[2])],
      {
        icon: icon({
          iconSize: [40, 40],
          iconAnchor: [22, 0],
          popupAnchor: [-3, -76],
          iconUrl: '/assets/images/subdivisionimg.png',
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
  onSubmit(form: NgForm) {
    
    this.subdivision.addSubdivision(form.value).subscribe((res: any) => {
      
        if (res.data == true) {
          
          if (this.isEdit) {
            this.toaster.success('Record Updated Successfully');
          } else {
            this.toaster.success('Record Saved Successfully');
          }

          $('#ModalAddSubdivision').modal('hide');
          this.cleanform();
          
          this.rerender();
        } else {
          
          this.toaster.error('Oops! Something Went wrong');
          $('#ModalAddSubdivision').modal('hide');
        }
     
    });
  }

  getSubDivision() {
    
    this.subdivision.getAllSubDivisioin().subscribe((res: any) => {

     
        
        this.headerdata = res.data[0][1];
        this.rowdata = [];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.rowdata.push(res.data[0][item]);
          }
        }
        this.dtTrigger.next();
        
      
    });
  }

  rerender(): void {
    this.getSubDivision();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items

    this.pageOfItems = pageOfItems;
  }

  getSubDivisionInfo(data: any) {
    

    this.isEdit = true;
    
    this.formdata = {
      latitude: data[1],
      longitude: data[2],
      substation_name: data[0],
      user_id: '',
    };
  }

  deleteSubDivisionInfo(deviceid: string) {
    this.formdata.substation_name = deviceid;
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
        this.subdivision
          .deleteSubDivion(this.formdata)
          .subscribe((res: any) => {
            if (res != null) {
             
                this.cleanform();
                Swal.fire('deleted successfully', '', 'success');
                
                this.rerender();
              
            }
          });
      }
    });
  }

  cleanform() {
    this.formdata = {
      user_id: '',
      substation_name: '',
      latitude: '',
      longitude: '',
    };
  }
}
