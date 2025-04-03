import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { RuleRequestModel } from 'src/app/Model/rule-request-model';
import { AuthService } from 'src/app/Service/auth.service';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-update-rule',
  templateUrl: './update-rule.component.html',
  styleUrls: ['./update-rule.component.css'],
})
export class UpdateRuleComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'VEE',
    levelurl: '',
    menuname: 'Update Rules',
    url: '/mdm/vee/',
  };
  //#endregion

  ruleName: string = '';
  createdDate: string = '';
  modifiedDate: string = '';
  noOfTimeModified: number = 0;
  ruleStatus: string = '';
  formData: RuleRequestModel = {
    datasetName: '',
    datasetParamName: '',
    levelApplied: localStorage.getItem('AccessLevel'),
    levelName: localStorage.getItem('AccessValue'),
    phase: '',
    ruleName: '',
    ruleStatus: '',
    userName: '',
    valueCheck: '',
    valueEstimation: '',
  };
  dataParamList: string[] = [];
  powerFactorValue: any[] = [];
  powerFactorEstValue: any[] = [];
  powerFactorOption = [{ data: '>1' }, { data: '<1' }];
  powerFactorEstOption = [{ data: '0' }, { data: '1' }];

  constructor(
    private route: ActivatedRoute,
    private service: VeeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private datePipe: DatePipe,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.ruleName = this.route.snapshot.params['name'];
    this.getRuleDetails();
  }

  getDataParam() {
    if (this.formData.datasetName == 'Instantaneous') {
      this.dataParamList = ['power_factor'];
    } else {
      this.dataParamList = [];
    }
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
        this.toastr.error('Value check and estimation count not match !');
      }
    }
    if (this.formData.valueCheck != '') {
      
      this.service.updateRule(this.formData).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
          this.router.navigate['/mdm/vee'];
          
        },
        (err) => {
          
          if (err.status == 400) this.toastr.error(err);
        }
      );
    }
  }
  getRuleDetails() {
    
    this.service.getRuleByName(this.ruleName).subscribe(
      (res: any) => {
        this.formData.ruleName = res['Rule Name'];
        this.formData.userName = res['User Name'];
        this.formData.datasetName = res['Dataset Name'];
        this.getDataParam();
        this.formData.datasetParamName = res['Dataset Param Name'];
        this.formData.levelApplied = res['Level Applied'];
        this.formData.levelName = res['Level Name'];
        this.formData.phase = res['Phase'];
        this.formData.valueCheck = res['Value Check'];
        this.formData.valueEstimation = res['Value Estimation'];

        this.createdDate = this.datePipe.transform(
          new Date(res['Creation Date']),
          'yyyy-MM-dd HH:mm'
        );
        this.modifiedDate = this.datePipe.transform(
          new Date(res['Last Modification Datetime']),
          'yyyy-MM-dd HH:mm '
        );

        this.noOfTimeModified = res['No Of Time Modified'];
        this.ruleStatus = res['Rule Status'];

        if (this.formData.datasetParamName == 'power_factor') {
          let factorsplitValue = this.formData.valueCheck.split(',');
          for (let item in factorsplitValue) {
            this.powerFactorValue.push({ data: factorsplitValue[item] });
          }
          let estsplitValue = this.formData.valueEstimation.split(',');
          for (let item in estsplitValue) {
            this.powerFactorEstValue.push({ data: estsplitValue[item] });
          }
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
  cancel() {
    this.router.navigate(['/mdm/vee']);
  }
}
