import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { UploadAtAccessLevel } from 'src/app/Model/iservice-request-add';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Configuration',
    url: '/mdm/prepaid',
  };

  IsAdd: boolean = false;
  IsList: boolean = true;
  IsDIP: boolean = false;
  IsPCP: boolean = false;
  IsLL: boolean = false;
  IsMM: boolean = false;
  IsCTO: boolean = false;

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

  members: Member[] = [];
  isAssignUser: boolean = false;
  excelfile1: any;
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
    this.getMembers();
  }

  Add() {
    this.IsAdd = true;
    this.IsList = false;
  }
  List() {
    this.IsList = true;
    this.IsAdd = false;
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
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

  setInput(event) {
    let value = event.target.value;
    if (value != null) {
      if (value == 'DIP') {
        this.IsDIP = true;
        this.IsCTO = false;
        this.IsLL = false;
        this.IsMM = false;
        this.IsPCP = false;
      } else if (value == 'CTO') {
        this.IsDIP = false;
        this.IsCTO = true;
        this.IsLL = false;
        this.IsMM = false;
        this.IsPCP = false;
      } else if (value == 'LL') {
        this.IsDIP = false;
        this.IsCTO = false;
        this.IsLL = true;
        this.IsMM = false;
        this.IsPCP = false;
      } else if (value == 'MM') {
        this.IsDIP = false;
        this.IsCTO = false;
        this.IsLL = false;
        this.IsMM = true;
        this.IsPCP = false;
      } else if (value == 'PCP') {
        this.IsDIP = false;
        this.IsCTO = false;
        this.IsLL = false;
        this.IsMM = false;
        this.IsPCP = true;
      }
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
}
