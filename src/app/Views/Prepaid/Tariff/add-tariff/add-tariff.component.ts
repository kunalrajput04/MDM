import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConsumerMeterInfo } from 'src/app/Model/consumer-meter-info';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { ITariffRequestAdd } from 'src/app/Model/iservice-request-add';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';


@Component({
  selector: 'app-add-tariff',
  templateUrl: './add-tariff.component.html',
  styleUrls: ['./add-tariff.component.css'],
})
export class AddTariffComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Add Tarrif',
    url: '/mdm/prepaid',
  };

  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  formData: ITariffRequestAdd = {
    requestID: 0,
    sectionLoad: '',
    requestByName: localStorage.getItem('Name'),
    requestReason: '',
    requestType: '',
    requestValue: '',
    response: '',
    remarks: '',
    requestTo: '',
    consumerNumber: '',
    requestStatus: 'Pending',
    oldTariff: '0',
    newTariff: '0',
    meterType:'',
    supplyCategory:'',
    billingCategory:'',
    monthlyRental:0,
    tarrifRate1:0,
    tarrifRate2:0,
    tarrifRate3:0,
    gstRate:0,
    lowBalance:0,
    tarrifName:'',
    tarrifStart:'',


    accessLevel: localStorage.getItem('AccessLevel'),
    accessValue: localStorage.getItem('AccessValue'),
  };
  
  subdivisonName: string = '';
  substationName: string = '';
  feederName: string = '';
  dtName: string = '';

  consumerGroup: string = '';
  members: Member[] = [];

  constructor(
    private service: ServiceRequestService,
    private userservice: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
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
