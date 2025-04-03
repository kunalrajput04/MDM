import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { ITariffRequestAdd } from 'src/app/Model/iservice-request-add';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';

@Component({
  selector: 'app-update-tariff-request',
  templateUrl: './update-tariff-request.component.html',
  styleUrls: ['./update-tariff-request.component.css'],
})
export class UpdateTariffRequestComponent implements OnInit {

   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Update Tarrif',
    url: '/mdm/prepaid',
  };


  formData: ITariffRequestAdd = {
    requestID: 0,
    sectionLoad: '',
    requestByName: localStorage.getItem('Name'),
    requestReason: '',
    requestType: '',
    response: '',
    remarks: '',
    requestTo: '',
    consumerNumber: '',
    requestValue: '',
    requestStatus: 'Pending',
    oldTariff: '0',
    newTariff: '0',
    meterType: '',
    supplyCategory: '',
    billingCategory: '',
    monthlyRental: 0,
    tarrifRate1: 0,
    tarrifRate2: 0,
    tarrifRate3: 0,
    gstRate: 0,
    lowBalance: 0,
    tarrifName:'',
    tarrifStart:'',
    accessLevel: localStorage.getItem('AccessLevel'),
    accessValue: localStorage.getItem('AccessValue'),
  };
  members: Member[] = [];

  isAssignUser: boolean = false;
  constructor(
    private service: ServiceRequestService,
    private userservice: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.getMembers();
    this.formData.requestID = this.route.snapshot.params['id'];
    this.getRequestDetails(this.formData.requestID);
    
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }
  getRequestDetails(requestID: number) {
    
    this.service.getTariffRequestDetails(requestID).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.formData = res.data;

          if (localStorage.getItem('Name') == this.formData.requestByName)
            this.isAssignUser = false;
          else this.isAssignUser = true;
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  manageRequest() {
    
    this.service.manageTariffRequest(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.router.navigate(['/mdm/prepaid/tariff']);
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
}
