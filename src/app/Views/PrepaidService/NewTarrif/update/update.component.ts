import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { NewTarrif, TarrifDropdown } from 'src/app/Model/new-tarrif';
import { AuthService } from 'src/app/Service/auth.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  datas: HeaderMenu = {
    firstlevel: 'Prepaid Servicer',
    levelurl: '',
    menuname: 'Update NewTarrif',
    url: '/mdm/PrepaidService',
  };
  tarrifdropdown: TarrifDropdown[]=[];
  newId:number=0;

  formData: NewTarrif = {
    newTarrifId:0,
    requestID:0,
    tarrifRate1:0,
    tarrifRate2:0,
    tarrifRate3:0,
    gstRate:0,
    lowBalance:0,   
    monthlyRental:0,
    tarrifStart:new Date,    
  };
  constructor(
    private service: PrepaidService,  
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,  
    private authservice: AuthService,
    private route:ActivatedRoute,
  ) {
    this.authservice.chagneHeaderNav(this.datas);
   }

  ngOnInit(): void {
    this.newId=this.route.snapshot.params['id'];
    console.log(this.newId);
    this.getTarrifDown();
    this.NewTarrifInfo();
  }

  getTarrifDown(){
    this.service.GetAllTariffDropdown().subscribe(
      (res: any) => {
        this.tarrifdropdown = res.data;
      },
      (err) => {}
    );
  }

  NewTarrifInfo(){
    
    this.service.GetNewTarrifInfo(this.newId).subscribe(
      (res:any)=>{
        
        if(res.success==true){
          this.formData=res.data;
        }else
        this.toastr.error(res.message);
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    )
  }

  onSubmit(){
    
    this.service.ManageNewTariff(this.formData).subscribe(
      (res:any)=>{
        
        if(res.success==true){
          this.toastr.success(res.message);
          this.router.navigate['/mdm/PrepaidService/newTarrif']
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
