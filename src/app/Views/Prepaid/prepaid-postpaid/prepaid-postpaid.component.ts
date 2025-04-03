import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PrepaidPostpaid } from 'src/app/Model/prepaid-postpaid';
import { AuthService } from 'src/app/Service/auth.service';
import { InstantDemandService } from 'src/app/Service/instant-demand.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prepaid-postpaid',
  templateUrl: './prepaid-postpaid.component.html',
  styleUrls: ['./prepaid-postpaid.component.css']
})
export class PrepaidPostpaidComponent implements OnInit {

 //#region  menu
 datas: HeaderMenu = {
  firstlevel: 'Instant Demand Service',
  levelurl: '',
  menuname: 'Prepaid/PostPaid',
  url: '/mdm/prepaid',
};


  datalist: PrepaidPostpaid[]=[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private service: InstantDemandService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }

  ngOnInit(): void {
    this.onList('prepaid');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,
      destroy:true,
      retrieve:true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },

      ],
    };

  }

  onList(data:any) {
    
    this.service.getPrepaidPostpaid(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.datalist = res.data
          
          this.dtTrigger.next();
         
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400)
          this.toastr.error(err);
      }
    );

  }

  getConsumer(event){
    console.log(event);
    this.rerender(event.target.value)
  }

  rerender(data:any): void {
    this.onList(data);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }


  

}
