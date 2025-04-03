import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { FitBoundsOptions, LatLngBounds, icon, MapOptions, marker, markerClusterGroup, MarkerClusterGroup, MarkerClusterGroupOptions, tileLayer, latLng } from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { Substation } from 'src/app/Model/substation';
import { AuthService } from 'src/app/Service/auth.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

declare let $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-substation',
  templateUrl: './substation.component.html',
  styleUrls: ['./substation.component.css'],
})
export class SubstationComponent implements OnInit {
  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'Substation',
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
  formData: Substation = {
    user_id: '',
    substation_name: '',
    subdivisionName: '',
    latitude: '',
    longitude: '',
  };

  subdivisionDropDown: any[] = [];
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
    private toastr: ToastrService,
    private substationservice: SubstationService,
    private router: Router,
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
        { extend: 'excel', title: 'Substation' },

        { extend: 'pdf', title: 'Substation' },
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
      data[1] +
      '<br><b>LATITUDE :</b> ' +
      data[2] +
      '<br><b>LONGITUDE :</b> ' +
      data[3] +
      '</div>';
    const newMarker = marker(
      [parseFloat(data[2]), parseFloat(data[3])],
      {
        icon: icon({
          iconSize: [40, 40],
          iconAnchor: [22, 0],
          popupAnchor: [-3, -76],
          iconUrl: '/assets/images/substationimg.png',
        }),
        title: data[1],
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
    
    this.substationservice.getSubstationData().subscribe((res: any) => {
      


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
    this.onTableget();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  onSubmit(form: NgForm) {
    $('#ModalUpdateSubstation').modal('hide');
    

    this.substationservice.addSubStation(form.value).subscribe((res: any) => {
      if (res != null) {


        
        if (this.isEdit) {
          this.toastr.success('Updated Successfully');
        } else {
          this.toastr.success('Created Successfully');
        }
        this.rerender();

      }
    });
  }

  getSubstationInfo(substation: any) {
    this.isEdit = true;

    this.getSubdivision();
    this.formData = {
      latitude: substation[2],
      longitude: substation[3],
      subdivisionName: substation[0],
      substation_name: substation[1],
      user_id: localStorage.getItem('HesUserID'),
    };
  }

  openAddModel() {
    this.isEdit = false;
    //this.formData = new Substion();
    this.getSubdivision();
  }
  getSubdivision() {
    
    this.subdivisionDropDown = [];

    this.subdivisionservice.getSubdivision().subscribe((res: any) => {

      let obj = res.data[0];
      for (var item in obj) {
        this.subdivisionDropDown.push(obj[item][0]);
      }

      

    });
  }
  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  deleteSubstationInfo(meterno: string) {
    //this.formData = new SubSt();
    this.formData.substation_name = meterno;

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
        this.substationservice
          .deleteSubstationData(this.formData)
          .subscribe((res: any) => {

            Swal.fire('deleted successfully', '', 'success');

            this.rerender();

          });
      }
    });
  }

  // logout() {
  //   this.service.logout();
  //   sessionStorage.removeItem('IsReload');
  //   this.router.navigate(['/login']);
  // }
}
