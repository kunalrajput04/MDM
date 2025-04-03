import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { validationRule } from 'src/app/Model/createValidation';
import { VeeService } from 'src/app/Service/vee.service';
import { MyCellComponent } from '../my-cell/my-cell.component';
@Component({
  selector: 'app-create-validation-rule',
  templateUrl: './create-validation-rule.component.html',
  styleUrls: ['./create-validation-rule.component.css'],
})
export class CreateValidationRuleComponent implements OnInit {
  IsEditable: boolean = false;
  formdata: validationRule = new validationRule();
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
      router.navigate(['mdm', 'vee', 'validationRule']);
    }
  }
  typeData = {};
  MeterType: any = ['Single phase', 'Three Phase', 'CT Meter', 'HT Meter'];
  parameters: any = ['kwh', 'pf', 'kvah', 'Md kw'];

  public validationtype = [
    { name: 'DLP', data: ['Descending', 'Max', 'KWH>KVAH'] },
    { name: 'Billing', data: ['Descending', 'Max', 'KWH>KVAH', 'PF', 'MD'] },
  ];

  ngOnInit(): void {
    this.typeData = this.validationtype.filter((x) => x.name == 'DLP')[0].data;
  }
  onChange(deviceValue: any) {
    console.log(deviceValue, 'deviceValue');
    this.typeData = this.validationtype?.filter(
      (x) => x.name == deviceValue.value
    )[0]?.data;
  }
  getBillingtype(value: any) {
    // console.log(value)
  }

  createValidationRule() {
    console.log(this.formdata);
    let filter = {
      id: 0,
      meterType: this.formdata.meterType,
      dataType: this.formdata.dataType,
      validationType: this.formdata.validationType,
      validationRuleType: this.formdata.validationRuleType,
      parameter: this.formdata.parameter,
      lowThreshold: this.formdata.lowThreshold,
      highThreshold: this.formdata.highThreshold,
      effectiveFrom: this.formdata.effectiveFrom,
      estimation: this.formdata.estimationRequired,
      status: this.formdata.status,
      ruleDescription: this.formdata.ruleDescription,
      createdBy: '',
      createdDate: '2023-03-01T13:48:29.974Z',
      modifyBy: 'string',
      modifyDate: '2023-03-01T13:48:29.974Z',
    };

    this.veeService.addNewData(filter).subscribe((res: validationRule) => {
      console.log(res);
      this.formdata = new validationRule();
      this.toster.success('Validation rule created successfully');
    });
    this.form.resetForm();
  }
  save() {
    console.log(this.formdata.id);
    let filter = {
      id: this.formdata.id,
      meterType: this.formdata.meterType,
      dataType: this.formdata.dataType,
      validationType: this.formdata.validationType,
      validationRuleType: this.formdata.validationRuleType,
      parameter: this.formdata.parameter,
      lowThreshold: this.formdata.lowThreshold,
      highThreshold: this.formdata.highThreshold,
      effectiveFrom: this.formdata.effectiveFrom,
      estimation: this.formdata.estimationRequired,
      status: this.formdata.status,
      ruleDescription: this.formdata.ruleDescription,
      createdBy: '',
      createdDate: '2023-03-01T13:48:29.974Z',
      modifyBy: 'string',
      modifyDate: '2023-03-01T13:48:29.974Z',
    };
    this.veeService.EditRecord(filter).subscribe((res: any) => {
      console.log(res);
      this.formdata = new validationRule();
      // this.formdata = res;
      this.toster.success('Validation rule edited successfully');
    });
    this.form.resetForm();
  }

  // ****************************************
}
