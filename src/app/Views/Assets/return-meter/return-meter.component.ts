import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MeterReturn } from 'src/app/Model/meter-inventory';
import { AssetsService } from 'src/app/Service/assets.service';

@Component({
  selector: 'app-return-meter',
  templateUrl: './return-meter.component.html',
  styleUrls: ['./return-meter.component.css']
})
export class ReturnMeterComponent implements OnInit {

  returnTo: MeterReturn={
    supplierName:'',
    chalanNo:'',
    meterType:'',
    meterCategory:'',
    meterCount:0,
    returnType:'',
    comments:''
  
  }
  constructor(
    private service: AssetsService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
    private route:ActivatedRoute,
   
  ) { }

  ngOnInit(): void {
  }

  returnToSupplier(){
   
    
    this.returnTo.meterType='Test';
    this.returnTo.returnType='Return To Supplier';
    this.returnTo.meterCategory='Faulty';
    this.service.manageMeterReturn(this.returnTo).subscribe(
      (res: any) => {
        if (res.success == true) {
          
          this.toastr.success(res.message);  
          this.cleanreturnto();
          // this.getInventoryStock(this.metertype);      
          // this.rerender();
          
          //this.getMeterInfo(this.route.snapshot.params['meter']);
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }


  cleanreturnto(){
    this.returnTo={
     supplierName:'',
     chalanNo:'',
     meterType:'',
     meterCategory:'',
     meterCount:0,
     returnType:'',
     comments:''
 
    }
 
   }
}
