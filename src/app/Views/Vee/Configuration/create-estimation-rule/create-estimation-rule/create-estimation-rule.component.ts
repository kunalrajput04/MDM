import { Component, OnInit, ViewChild } from '@angular/core';
import { estimationRule } from 'src/app/Model/createEstimation';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { validationRule } from 'src/app/Model/createValidation';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-create-estimation-rule',
  templateUrl: './create-estimation-rule.component.html',
  styleUrls: ['./create-estimation-rule.component.css']
})
export class CreateEstimationRuleComponent implements OnInit {
  IsEditable: boolean = false;
  formdata:estimationRule  = new estimationRule();
  @ViewChild('form') form: NgForm;
  constructor(
    private veeService: VeeService,
    private toster: ToastrService,
    private router: Router
  ) {
    this.IsEditable = !!router.getCurrentNavigation()?.extras?.state?.from;
    if (router.getCurrentNavigation()?.extras?.state?.with) {
      this.formdata = router.getCurrentNavigation()?.extras?.state?.with;
      console.log(this.formdata);
    } else if (router.url.includes('Edit')) {
      router.navigate(['mdm', 'vee', 'estimationRule']);
    }
  }
  typeData = {};
  typeData1 = {};
  MeterType: any = ['Single phase', 'Three Phase', 'CT Meter', 'HT Meter'];
  parameters: any = ['kwh', 'pf', 'kvah', 'Md kw'];

  public logic = [
    // { name: 'DLP', data: ['Descending', 'Max', 'KWH>KVAH'] },
    { name: 'DLP', data: ['Average'] },
    // { name: 'Billing', data: ['Descending', 'Max', 'KWH>KVAH', 'PF', 'MD'] },
    { name: 'Billing', data: ['Average_Bill'] },
  ];

  public period = [
    { name: 'DLP', data: ['weekly','Biweekly','Monthly'] },
    { name: 'Billing', data: ['3Months','6Months'] },
  ];

  ngOnInit(): void {
  this.typeData = this.logic.filter((x) => x.name == 'DLP')[0].data;
  this.typeData1 = this.period.filter((x) => x.name == 'DLP')[0].data;
  console.log(this.typeData,this.typeData1)
}

  onChange(deviceValue: any) {
    console.log(deviceValue, 'deviceValue');
    this.typeData = this.logic?.filter(
      (x) => x.name == deviceValue.value
    )[0]?.data;

    this.typeData1 = this.period?.filter(
      (x) => x.name == deviceValue.value
    )[0]?.data;
  }
  getBillingtype(value: any) {
    // console.log(value)
  }

  createValidationRule() {
    console.log(this.formdata);
    let filter = {
      dataType: this.formdata.dataType,
      logic : this.formdata.logic,
      ruleName : this.formdata.ruleName,
      parameter : this.formdata.parameter,
      period : this.formdata.period,
      status : this.formdata.status,
      meterType : this.formdata.meterType,
      ruleDescription : this.formdata.ruleDescription
    };

    this.veeService.createEstimation(filter).subscribe((res: validationRule) => {
      console.log(res);
      this.formdata = new estimationRule();
      this.toster.success('Estimation rule created successfully');
    });
    this.form.resetForm();
  }
  save() {
    console.log(this.formdata.estimationId);
    let filter = {
      estimationId : this.formdata.estimationId,
      meterType: this.formdata.meterType,
      dataType: this.formdata.dataType,
      logic : this.formdata.logic,
      ruleName : this.formdata.ruleName,
      parameter : this.formdata.parameter,
      period : this.formdata.period,
      status : this.formdata.status,
      ruleDescription : this.formdata.ruleDescription
    };
    this.veeService.EditESTRecord(filter).subscribe((res: any) => {
      console.log(res);
      this.formdata = new estimationRule();
      // this.formdata = res;
      this.toster.success('Estimation rule edited successfully');
    });
    this.form.resetForm();
  }

  // ****************************************
}
