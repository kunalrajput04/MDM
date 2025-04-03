import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IConfigRequest } from 'src/app/Model/iconfig-request';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { IConfigServiceService } from 'src/app/Service/iconfig-service.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';


@Component({
  selector: 'app-add-sanction',
  templateUrl: './add-sanction.component.html',
  styleUrls: ['./add-sanction.component.css']
})
export class AddSanctionComponent implements OnInit {

    //#region  menu
    datas: HeaderMenu = {
      firstlevel: 'Instant Demand Service',
      levelurl: '',
      menuname: 'Add Sanction',
      url: '/mdm/prepaid',
    };
    
    subdivisionDropDown: any[] = [];
    substatioDropDown: any[] = [];
    feederDropDown: any[] = [];
    dtDropDown: any[] = [];
  
    formData: IConfigRequest = {
      configID: 0,
      requestByName: '',
      remarks: '',
      requestNumber: '',
      requestReason: '',
      requestStatus: '',
      requestTo: 0,
      requestType: '',
      requestValue: '',
      response: '',
      configurationType: '',
      configurationValue: '',
    };
  
    subdivisonName: string = '';
    substationName: string = '';
    feederName: string = '';
    dtName: string = '';
  
    consumer: string = '';
    members: Member[] = [];
  
    isAssignUser: boolean = false;
    excelfile1: any;
    demandIntegration: string = '900';
    loadLimit: string = '';
    meteringMode: string = '';
    profileCaptured: string = '900';
    CoverOpen: string = 'Y';
    CurrentBalanceAmount: string = '0';
  

  constructor(
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private userservice: UserService,
    private spinner: NgxSpinnerService,
    private service: IConfigServiceService,
    private toastr: ToastrService,
    private router: Router,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {

    this.getMembers();
    this.getSubdivision();
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }
  manageRequest() {
    
    if (this.formData.requestType == 'Consumer') {
      this.formData.requestValue = this.consumer;
    }
    if (this.formData.requestType == 'SUBDEVISION') {
      this.formData.requestValue = this.subdivisonName;
    }
    if (this.formData.requestType == 'SUBSTATION') {
      this.formData.requestValue = this.substationName;
    }
    if (this.formData.requestType == 'FEEDER') {
      this.formData.requestValue = this.feederName;
    }
    if (this.formData.requestType == 'DT') {
      this.formData.requestValue = this.dtName;
    }

    if (this.formData.configurationType == 'DemandIntegrationPeriod')
      this.formData.configurationValue = this.demandIntegration;
    if (this.formData.configurationType == 'profileCapturePeriod')
      this.formData.configurationValue = this.profileCaptured;
    if (this.formData.configurationType == 'LoadLimit')
      this.formData.configurationValue = this.loadLimit;
    if (this.formData.configurationType == 'MeteringMode')
      this.formData.configurationValue = this.meteringMode;
    if (this.formData.configurationType == 'CoverOpen')
      this.formData.configurationValue = this.CoverOpen;
    if (this.formData.configurationType == 'CurrentBalanceAmount')
      this.formData.configurationValue = this.CurrentBalanceAmount;

    this.service.manageRequest(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.router.navigate(['/mdm/prepaid/configuration']);
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
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

  getSubstation() {
    
    this.substation
      .getSubstationBySubdivision(this.subdivisonName)
      .subscribe((res: any) => {
        
        this.substatioDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
       
      });
  }
  getFeeder() {
    
    this.feederservice
      .getFeederBySubstation(this.substationName)
      .subscribe((res: any) => {
        
        this.feederDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
       
      });
  }
  getDT() {
    
    this.dtservice.getDTByFeeder(this.feederName).subscribe((res: any) => {
      
      this.dtDropDown = [];
     
        
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      
    });
  }

}
