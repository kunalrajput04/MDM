import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IBoosterRequest } from 'src/app/Model/ibooster-request';
import { AuthService } from 'src/app/Service/auth.service';
import { BoosterServiceService } from 'src/app/Service/booster-service.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

@Component({
  selector: 'app-update-booster',
  templateUrl: './update-booster.component.html',
  styleUrls: ['./update-booster.component.css']
})
export class UpdateBoosterComponent implements OnInit {

   //#region  menu
datas: HeaderMenu = {
  firstlevel: 'Instant Demand Service',
  levelurl: '',
  menuname: 'Update Booster',
  url: '/mdm/prepaid',
};


  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  formData: IBoosterRequest = {
   balance:'',
   boosterID:0,
   fromDate:'',
   remarks:'',
   requestNumber:'',
   requestReason:'',
   requestStatus:'',
   requestTo:0,
   requestType:'',
   requestValue:'',
   response:'',
   toDate:'',
   requestByName:''
  }

  subdivisonName: string = '';
  substationName: string = '';
  feederName: string = '';
  dtName: string = '';

  consumerGroup: string = '';
  members: Member[] = [];

  isAssignUser:boolean=false;
  constructor(
    private userservice: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private service: BoosterServiceService,
    private route: ActivatedRoute,

  private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }
  ngOnInit(): void {
    this.formData.boosterID = this.route.snapshot.params['id'];
    this.getMembers();
    
    this.getRequestDetails(this.formData.boosterID);
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {
      }
    );
  }
  getRequestDetails(requestID:number) {
    
    this.service.getBoosterDetails(requestID).subscribe(
      (res: any) => {
        if (res.success == true) {
          
          this.formData = res.data
          if(localStorage.getItem('Name')==this.formData.requestByName)
          this.isAssignUser=false;
          
          else
          this.isAssignUser=true;
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400)
          this.toastr.error(err);
      }
    );

  }

  manageRequest() {
    
    if (this.formData.requestType == 'ConsumerGroup') {
      this.formData.requestValue = this.consumerGroup;
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
   
    this.service.manageRequest(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message)
          this.router.navigate(['/mdm/prepaid/buster']);

        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400)
          this.toastr.error(err);
      }
    );

  }

  


}
