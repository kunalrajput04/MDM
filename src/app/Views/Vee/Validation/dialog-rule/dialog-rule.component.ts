import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { validationRule } from 'src/app/Model/createValidation';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-dialog-rule',
  templateUrl: './dialog-rule.component.html',
  styleUrls: ['./dialog-rule.component.css']
})
export class DialogRuleComponent implements OnInit {
  
  RuleData={}
  RuleData2:any;
  formdata: validationRule = new validationRule();
  constructor(private veesr:VeeService, private toster: ToastrService,
    public dialogRef: MatDialogRef<DialogRuleComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    
    console.log(this.dialogData)
   
    console.log(this.checkData(this.dialogData))

    this.RuleData = this.checkData(this.dialogData);
  }

  checkData(data) {
    const finalData = {}
    data.filter(r=> r.dataType !== "Billing" ).map((d)=> {
        if(!finalData[d['dataType']]?.length)
            finalData[d['dataType']] = []
        finalData[d['dataType']].push(d)
    })
    
    return finalData
}

  Run(Event:any){
    console.log(this.formdata.dataType)
    // if(this.formdata.dataType == "DLP"){
    switch(Event) { 
      case 'Descending': { 
        this.veesr.RunValidationRule(dummy).subscribe((res)=>{
          console.log(res)
          this.dialogRef.close(res);
          this.toster.success('DLP PostCompareData Decending Rule work successfully');
        });
         break;
      } 
      case 'Max': { 
        this.veesr.RunValidationRule2(dummy).subscribe((res)=>{
          this.dialogRef.close(res);
          this.toster.success('DLP MaxThrehold Rule work successfully');
        });
         break; 
      } 
      case 'KWH>KVAH': { 
        this.veesr.RunValidationRule3(dummy).subscribe((res)=>{
          this.dialogRef.close(res);
          this.toster.success('DLP CompareKWhKVH Rule work successfully');
        });
        break; 
     }
      default: { 
        this.toster.error('DLP Rule Type not found');
         break; 
      } 
   }
  }
  // else{
  //   switch(Event) { 
  //     case 'Descending': { 
  //       this.veesr.RunValidationBillingRule(dummy).subscribe((res)=>{
  //         console.log(res)
  //         this.dialogRef.close(res);
  //         this.toster.success('Billing PostCompareData Decending Rule work successfully');
  //       });
  //        break; 
  //     } 
  //     case 'Max': { 
  //       this.veesr.RunValidationBillingRule2(dummy).subscribe((res)=>{
  //         this.dialogRef.close(res);
  //         this.toster.success('Billing MaxThrehold Rule work successfully');
  //       });
  //        break; 
  //     } 
  //     case 'KWH>KVAH': { 
  //       this.veesr.RunValidationBillingRule3(dummy).subscribe((res)=>{
  //         this.dialogRef.close(res);
  //         this.toster.success('Billing CompareKWhKVH Rule work successfully');
  //       });
  //       break; 
  //    }
  // //    case 'PF': { 
  // //     this.veesr.RunValidationBillingRule4PF(dummy).subscribe((res)=>{
  // //       this.dialogRef.close(res);
  // //       this.toster.success('Billing ComparePF Rule work successfully');
  // //     });
  // //     break; 
  // //  }
  //    default: { 
  //     this.toster.error('Billing Rule Type not found');
  //      break; 
  //   } 
  //  } //switch close
  // } //else close
  // } 
}
const dummy = {
  "id": 0,
  "createdOn": "2023-03-07T10:53:04.712Z",
  "ruleCode": "string",
  "total": 0,
  "success": 0,
  "fail": 0,
  "status": "string"
}
