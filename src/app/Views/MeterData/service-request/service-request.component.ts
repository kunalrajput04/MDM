import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IServiceRequest } from 'src/app/Model/iservice-request';
import { AuthService } from 'src/app/Service/auth.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit {

  //#region  menu
 datas: HeaderMenu = {
  firstlevel: 'Demand Service',
  levelurl: '',
  menuname: 'Service Request',
  url: '/mdm/prepaid',
};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  rowdata: IServiceRequest[] = [];
  isAdd: boolean = false;
  
  
  excelfile1: any;
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];

  @ViewChild('closebutton') closebutton;
  constructor(private service: ServiceRequestService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Load Data' },
        { extend: 'pdf', title: 'Load Data' },
      ],
    };
    this.onList();
    
  }

  onList() {
    
    this.service.getAll().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.rowdata = res.data
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

  
 
 

  

  

}
