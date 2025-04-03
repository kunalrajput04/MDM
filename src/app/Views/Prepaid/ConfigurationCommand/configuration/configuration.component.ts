import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { UploadAtAccessLevel } from 'src/app/Model/iservice-request-add';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { IConfigServiceService } from 'src/app/Service/iconfig-service.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
export interface IConfigurationList{
  configID: number;
  requestType: string;
  requestValue: string;
  requestDate: string;
  requestNumber: string;
  requestByName: string;
  requestTo:string;
  configurationType:string;
  configurationValue:string;
  requestStatus:string;
  
  requestBy:string;
}
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {

  //#region  menu
datas: HeaderMenu = {
  firstlevel: 'Instant Demand Service',
  levelurl: '',
  menuname: 'Configurations',
  url: '/mdm/prepaid',
};

  
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  rowdata: IConfigurationList[] = [];
  excelfile: any;
  members: Member[] = [];
  constructor(
    private service: IConfigServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userservice: UserService,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Load Data' },
        { extend: 'pdf', title: 'Load Data' },
      ],
    };
    this.onList();
    
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }

  onList() {
    
    this.service.getConfigurationAll().subscribe(
      (res: any) => {
        if (res.success == true) {
          
          this.rowdata = res.data;
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
