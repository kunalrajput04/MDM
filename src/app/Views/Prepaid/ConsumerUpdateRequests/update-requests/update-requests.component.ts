import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { ConsumerUpdateRequest } from 'src/app/Model/iservice-request';
import { TarrifDropdown } from 'src/app/Model/new-tarrif';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';

@Component({
  selector: 'app-update-requests',
  templateUrl: './update-requests.component.html',
  styleUrls: ['./update-requests.component.css']
})
export class UpdateRequestsComponent implements OnInit {

   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Service Order',
    levelurl: '',
    menuname: 'Update Requests ',
    url: '/mdm/prepaid',
  };

  tarrif: TarrifDropdown[]=[];
  formdata: ConsumerUpdateRequest={
    requestID:0,
    requestNumber:'',
    requestStatus:'',
    consumerNo:'',
    requestReason:'',
    response:'',
    assignTo:0,
    changeTo:'',
    netMetering:'',
    billingTarrif:0,
    pendingAmount:0,
    arial:'',
    remarks:'',
    autoDisconnect:false,
    updated:new Date
  }
  members: Member[] = [];
  newId:number=0;
  constructor(
    private service: PrepaidService,  
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,  
    private userservice: UserService,
    private authservice: AuthService,
    private route:ActivatedRoute,
  ) { 
    this.newId=this.route.snapshot.params['id'];
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.getTarrifDown();
    this.requestinfo();
  }

  requestinfo(){
    
    this.service.GetConsumerUpdateInfo(this.newId).subscribe(
      (res:any)=>{
        
        if(res.success==true){
          this.formdata=res.data;
        }else
        this.toastr.error(res.message);
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    )
  }
  
  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }

  getTarrifDown(){
    this.service.GetAllTariffDropdown().subscribe(
      (res: any) => {
        this.tarrif = res.data;
      },
      (err) => {}
    );
  }

  onSubmit(){
    
    this.service.ManageConsumerRequest(this.formdata).subscribe(
      (res:any)=>{
        
        if(res.success==true){
          this.toastr.success(res.message);
          this.router.navigate['/mdm/prepaid/UpdateRequests'];
        }else{
          this.toastr.error(res.message);
        }
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    )
  }

}
