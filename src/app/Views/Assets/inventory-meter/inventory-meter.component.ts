import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { InventoryStock, MeterInventory, MeterInventoryList, MeterReceived, MeterReturn, MeterReturnList } from 'src/app/Model/meter-inventory';
import { AssetsService } from 'src/app/Service/assets.service';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-inventory-meter',
  templateUrl: './inventory-meter.component.html',
  styleUrls: ['./inventory-meter.component.css']
})
export class InventoryMeterComponent implements OnInit {

returnTo: MeterReturn={
  supplierName:'',
  chalanNo:'',
  meterType:'',
  meterCategory:'',
  meterCount:0,
  returnType:'',
  comments:''

}


receivedForm: MeterReturn={
  supplierName:'',
  chalanNo:'',
  meterType:'',
  meterCategory:'',
  meterCount:0,
  returnType:'',
  comments:''

}

forms:MeterReceived={
  supplier:'',
  chalan:'',
  type:'',
  category:'',
  count:0,
  return:'',
  comment:''
  
}
 

  formdata:MeterInventory={
    meterType:'',
    supplier:'',
    chalanNo:'',
    totalStock:0,
    liveStock:0,
    faultStock:0,
    returnStock:0,
    receivedStock:0,
    descriptions:''
  }

  meterlist:MeterReturnList[]=[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  metertype:string;
  data: InventoryStock={
    type: '',
    live:0,
    received:0,
    return:0,
    ok:0,
    faulty:0,
    pending:0,
    total:0
  };
   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Assets',
    levelurl: '',
    menuname: 'InventoryMeter',
    url: '/mdm/assets/',
  };

  //#endregion


  constructor(
    private service: AssetsService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
    private route:ActivatedRoute,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }
  ngOnInit(): void {
    this.metertype=this.route.snapshot.params['meter'];
    this.getInventorylist(this.metertype);
    this.getMeterInfo(this.metertype);
    this.getInventoryStock(this.metertype);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };
  }

  getInventorylist(data:any){
    this.service.getMeterReturnLogs(data).subscribe(
      (res:any)=>{
        if(res.success==true){
           this.meterlist=res.data;          
           this.dtTrigger.next();

        }
      }
    )
  }

  getMeterInfo(data:any){
    this.service.getlastEntry(data).subscribe(
      (res:any)=>{
        
        if(res.success==true){
          
          this.formdata.meterType=res.data.meterType;
          this.formdata.supplier=res.data.supplier;
          this.formdata.chalanNo=res.data.chalanNo;
          this.formdata.totalStock=res.data.totalStock;
          this.formdata.faultStock=res.data.faultStock;
          this.formdata.liveStock=res.data.liveStock;
          this.formdata.returnStock=res.data.returnStock;
          this.formdata.receivedStock=res.data.receivedStock;
          this.formdata.descriptions=res.data.descriptions;
          
          
        }else{
          
        }
        (err) => {
          
          if (err.status == 400) this.toastr.error(err);
        }

      }
    )
  }

  returnToSupplier(){
   
    
    this.returnTo.meterType=this.metertype;
    this.returnTo.returnType='Return To Supplier';
    this.returnTo.meterCategory='Faulty';
    this.service.manageMeterReturn(this.returnTo).subscribe(
      (res: any) => {
        if (res.success == true) {
          
          this.toastr.success(res.message);  
          this.cleanreturnto();
          this.getInventoryStock(this.metertype);      
          this.rerender();
          
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

  receivedFromSupplier(){

    
    this.receivedForm.meterType=this.metertype;
    this.receivedForm.returnType='Received From Supplier';
    
    this.service.manageMeterReturn(this.receivedForm).subscribe(
      (res: any) => {
        if (res.success == true) {
          
          this.toastr.success(res.message);  
          this.cleanReceivedFrom();
          this.getInventoryStock(this.metertype);      
          this.rerender();
         
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
  receivedFromSuppliers(){
    
  }

 getInventoryStock(data:any){
  
   this.service.getInventoryStock(data).subscribe(
     
     (res:any)=>{
       if(res.success==true){
         this.data=res.data;            
               
       }
       else{
         
       }
     },
     (err) => {
      
      if (err.status == 400) this.toastr.error(err);
    }
   )
 }


 
  rerender(): void {
    this.getInventorylist(this.route.snapshot.params['meter']);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
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

  cleanReceivedFrom(){
    this.receivedForm={
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
