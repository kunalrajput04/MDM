import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { validationRule } from 'src/app/Model/createValidation';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-monthly-billing-rule',
  templateUrl: './monthly-billing-rule.component.html',
  styleUrls: ['./monthly-billing-rule.component.css']
})
export class MonthlyBillingRuleComponent implements OnInit {
  RuleData:any;
  RuleData2:{};
  formdata: validationRule = new validationRule();
  constructor(private veesr:VeeService, private toster: ToastrService,
    public dialogRef: MatDialogRef<MonthlyBillingRuleComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    
    console.log(this.dialogData)
   
    console.log(this.checkData(this.dialogData))

    this.RuleData = this.checkData(this.dialogData);

    console.log(this.RuleData)
  }

  checkData(data) {
    const finalData = {}
    data.filter(r=> r.dataType == "Billing").map((d)=> {
        if(!finalData[d['dataType']]?.length)
            finalData[d['dataType']] = []
        finalData[d['dataType']].push(d)
    })
    
    return finalData
}
// CheckData From Mixed-MeterType*********************************


  Run(Event:any,validationRule: any){
    console.log(Event)
    const currentSellection = this.RuleData?.Billing.find(
      (r) => r.validationRuleType === Event
    );
    console.log(currentSellection);
    if(currentSellection){}
    if (currentSellection.meterType !== 'Single phase') {

      switch ((currentSellection.validationType as string).toLowerCase()) {
        case 'descending': {
      // DESC******************************
      let id = currentSellection.id;
      console.log(id)
      this.veesr.RunMixedMonthlyBillingDesc({vruleid:id}).subscribe((res) => {
        console.log(res);
        // ***************************
        
        this.dialogRef.close({...res, type: currentSellection.meterType});
        this.toster.success('Monthly(Bill) Mixed Decending Rule work successfully');
      });
      break;
    }
    case 'max' : {
      let id = currentSellection.id;
      console.log(id)
      this.veesr.RunMixedMonthlyBillingMax({vruleid:id}).subscribe((res) => {
        console.log(res);
        // ***************************
        this.dialogRef.close({...res, type: currentSellection.meterType});
        // this.dialogRef.close(res);
        this.toster.success('Monthly(Bill) Mixed Max Rule work successfully');
      });
      break;
    }
   
    case 'kwh>kvah': {
      let id = currentSellection.id;
      console.log(id)
      this.veesr.RunMixedMonthlyBillingKVH({vruleid:id}).subscribe((res) => {
        console.log(res);
        // ***************************
        this.dialogRef.close({...res, type: currentSellection.meterType});
        // this.dialogRef.close(res);
        this.toster.success('Monthly(Bill) Mixed KVH Rule work successfully');
      });
      break;
    }

    case 'pf': {
      let id = currentSellection.id;
      console.log(id)
      this.veesr.RunMixedMonthlyBillingPF({vruleid:id}).subscribe((res) => {
        console.log(res);
        // ***************************
        this.dialogRef.close({...res, type: currentSellection.meterType});
        this.toster.success('Monthly(Bill) Mixed PF Rule work successfully');
      });
      break;
    }
  }//Switch Off
}//IF Case Off
    // console.log(Event)
       else{
    switch((currentSellection.validationType as string).toLowerCase()) { 
      case 'descending': { 
        let id = currentSellection.id;
        console.log(id)
        this.veesr.RunValidationBillingRule({vruleid:id}).subscribe((res:any)=>{
          console.log(res)
          this.dialogRef.close({...res, type: currentSellection.meterType});
          this.toster.success('Billing Decending Rule work successfully');
        });
         break; 
      } 
      case 'max': { 
        let id = currentSellection.id;
        console.log(id)
        this.veesr.RunValidationBillingRule2({vruleid:id}).subscribe((res)=>{
          this.dialogRef.close({...res, type: currentSellection.meterType});
          this.toster.success('Billing MaxThrehold Rule work successfully');
        });
         break; 
      } 
      case 'kwh>kvah': { 
        let id = currentSellection.id;
        console.log(id)
        this.veesr.RunValidationBillingRule3({vruleid:id}).subscribe((res)=>{
          this.dialogRef.close({...res, type: currentSellection.meterType});
          this.toster.success('Billing CompareKWhKVH Rule work successfully');
        });
        break; 
     }
     case 'pf': { 
      let id = currentSellection.id;
      console.log(id)
      this.veesr.RunValidationBillingRule4PF({vruleid:id}).subscribe((res)=>{
        this.dialogRef.close({...res, type: currentSellection.meterType});
        this.toster.success('Billing PF Rule work successfully');
      });
      break; 
   }
      default: { 
        this.toster.error('Billing Rule Type not found');
         break; 
      } 
   }
  }

  }
}



