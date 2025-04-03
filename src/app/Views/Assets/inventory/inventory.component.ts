import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { InventoryDashboardInfo, MeterInventory } from 'src/app/Model/meter-inventory';
import { AssetsService } from 'src/app/Service/assets.service';
import { AuthService } from 'src/app/Service/auth.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

     //#region  menu
     data: HeaderMenu = {
      firstlevel: 'Assets',
      levelurl: '',
      menuname: 'Inventory',
      url: '/mdm/assets/',
    };
  
    //#endregion
    
    dashboard: InventoryDashboardInfo={
      inventoryDashboards:[],
      live:0,
      total:0
    };
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
  today:Date=new Date
  constructor(
    private service: AssetsService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.data);
    }

  ngOnInit(): void {
    this.getInventorydashboard();
  }

  manageForm() {
    
    this.service.manageInventory(this.formdata).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);        
          this.cleanForm();
        } else {
          this.toastr.error(res.message);
        }
        
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  getInventorydashboard(){
    this.service.getInventoryDashboard().subscribe(
      (res:any)=>{
        
        if(res.success==true){
          
          this.dashboard=res.data;
          
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    )
  }

  cleanForm(){
   this.formdata={
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

  }
}
