import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IServiceRequest } from 'src/app/Model/iservice-request';
import {
  IServiceRequestAdd,
  ITariffRequestAdd,
  UploadAtAccessLevel,
} from 'src/app/Model/iservice-request-add';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';


@Component({
  selector: 'app-tariff-category',
  templateUrl: './tariff-category.component.html',
  styleUrls: ['./tariff-category.component.css'],
})
export class TariffCategoryComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Manage Tarrif',
    url: '/mdm/prepaid',
  };
  
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  rowdata: IServiceRequest[] = [];
  isAdd: boolean = false;

  accessform: UploadAtAccessLevel = {
    accessLevel: 'ALL',
    subdivisonName: '',
    substationName: '',
    feederName: '',
    dtName: '',
  };

  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];

  isAssignUser: boolean = false;
  excelfile1: any;
  @ViewChild('closebutton') closebutton;
  constructor(
    private service: ServiceRequestService,
    private userservice: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Load Data' },
        { extend: 'pdf', title: 'Load Data' },
      ],
    };
    this.onList();
  }

  onList() {
    
    this.service.getTariffAll().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.rowdata = res.data;
          this.dtTrigger.next();
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  onChange1(data: any) {
    let file = data.target.files;
    this.excelfile1 = file.item(0);
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
}
