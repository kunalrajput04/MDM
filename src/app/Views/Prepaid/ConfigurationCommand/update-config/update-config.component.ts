import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IConfigRequest } from 'src/app/Model/iconfig-request';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { IConfigServiceService } from 'src/app/Service/iconfig-service.service';

@Component({
  selector: 'app-update-config',
  templateUrl: './update-config.component.html',
  styleUrls: ['./update-config.component.css']
})
export class UpdateConfigComponent implements OnInit {
   //#region  menu
datas: HeaderMenu = {
  firstlevel: 'Instant Demand Service',
  levelurl: '',
  menuname: 'Update Configuration',
  url: '/mdm/prepaid',
};
  
  members: Member[] = [];

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
    configurationValue: ''

  }
  isAssignUser:boolean=false;
  constructor(
    private userservice: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private service: IConfigServiceService,
    private route: ActivatedRoute,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }

  ngOnInit(): void {
    this.formData.configID = this.route.snapshot.params['id'];
    this.getMembers();
    
    this.getRequestDetails(this.formData.configID);
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
    
    this.service.getConfigDetails(requestID).subscribe(
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
    
   
    this.service.manageRequest(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message)
          this.router.navigate(['/mdm/prepaid/configuration']);

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

callMethod()
{
  if( this.formData.requestStatus=='Accept')
  {
    //this.onExecueCommand();
    this.manageRequest();
  }
  else
  {
    this.manageRequest();
  }
}
  
  // onExecueCommand() {
  //   
  //   this.service
  //     .executeCommandForConfiguration(
  //       this.formData.configurationType,
  //       this.formData.configurationValue,
  //       this.formData.requestType,
  //       this.formData.requestValue
  //     )
  //     .subscribe((res: any) => {
  //       

  //       if (res.data != null) {
  //         if (res.data == true) {
  //           this.manageRequest();
            
  //         } else {
  //           this.toastr.success('Something went wrong !!');
  //         }
  //       }
  //     });
  // }


  



}
