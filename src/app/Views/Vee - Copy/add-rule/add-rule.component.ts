import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { RuleRequestModel } from 'src/app/Model/rule-request-model';
import { AuthService } from 'src/app/Service/auth.service';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css'],
})
export class AddRuleComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'VEE',
    levelurl: '',
    menuname: 'Add Rules',
    url: '/mdm/vee/',
  };

  //#endregion

  formData: RuleRequestModel = {
    datasetName: '',
    datasetParamName: '',
    levelApplied: localStorage.getItem('AccessLevel'),
    levelName: localStorage.getItem('AccessValue'),
    phase: '',
    ruleName: '',
    ruleStatus: 'Inactive',
    userName: localStorage.getItem('Name'),
    valueCheck: '',
    valueEstimation: '',
  };
  datasets:string[]=[];
  dataParamList: string[] = [];
  powerFactorValue: any[] = [];
  powerFactorEstValue: any[] = [];
  powerFactorOption = [{ data: '>1' }, { data: '<1' }];
  powerFactorEstOption = [{ data: '0' }, { data: '1' }];
  loading: boolean = false;
  virtualScroll: boolean = true;

  constructor(
    private toster: ToastrService,
    private spinner: NgxSpinnerService,
    private service: VeeService,
    private router: Router,
    private config: NgSelectConfig,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
    this.config.notFoundText = 'Records not found';
    this.config.loadingText = 'Data loading...';
    this.config.placeholder = 'Select Data Param ';
  }

  ngOnInit(): void {
    this.getVeeDataSet();
  }

  // getDataParam() {
  //   if (this.formData.datasetName == 'Instantaneous') {
  //     this.dataParamList = ['power_factor'];
  //   } else {
  //     this.dataParamList = [];
  //   }
  // }

  getDataParam(data:any) {
     //let consumernumber = data.target.value;
    // if (consumernumber.length > 3) {
    //   this.loading = true;
    //   this.storeservice.getConsumerNumberList(consumernumber).subscribe(
    //     (res: any) => {
    //       this.consumerno = res.data;
    //       this.loading = false;
    //     },
    //     (err) => {
    //       
    //     }
    //   );
    // }

    this.loading = true;
    this.service.getDataParams(data).subscribe(
      (res: any) => {
        this.dataParamList = res.data;
        this.loading = false;
      },
      (err) => {
        
      }
    ); 
    
    
  }

  onSumbit() {
    if (this.formData.datasetParamName == 'power_factor') {
      if (this.powerFactorValue.length == this.powerFactorEstValue.length) {
        this.formData.valueCheck = this.powerFactorValue
          .map((item) => {
            return item.data;
          })
          .join(',');
        this.formData.valueEstimation = this.powerFactorEstValue
          .map((item) => {
            return item.data;
          })
          .join(',');
      } else {
        this.toster.error('Value check and estimation count not match !');
      }
    }
    if (this.formData.valueCheck != '') {
      
      this.service.addRule(this.formData).subscribe(
        (res: any) => {
          
          this.toster.success(res.message);

          this.router.navigate['/mdm/vee'];
          
        },
        (err) => {
          
          if (err.status == 400) this.toster.error(err);
        }
      );
    }
  }

 getVeeDataSet(){
   this.service.getDataSet().subscribe(
     (res:any)=>{
       if(res.data!=null){
         this.datasets=res.data;
        
       }
     }
   )
 }




  cancel() {
    this.formData = {
      datasetName: '',
      datasetParamName: '',
      levelApplied: '',
      levelName: '',
      phase: '',
      ruleName: '',
      ruleStatus: '',
      userName: '',
      valueCheck: '',
      valueEstimation: '',
    };
  }
}
