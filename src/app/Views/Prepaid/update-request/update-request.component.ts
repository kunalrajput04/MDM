import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import Swal from 'sweetalert2';
export interface IConsumerRequestList {
  requestID: number;
  requestNumber: string;
  assignTo: number;
  consumerNo: string;
  requestStatus: string;
  changeTo: string;
  requestReason: string;
  response: string;
  created: string;
  createdBy: string;
  assignName: string;
  createdName: string;
  isChecked: boolean;
}
@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.css'],
})
export class UpdateRequestComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Consumer Requests',
    url: '/mdm/prepaid',
  };
  //#endregion

  assignTo: number = 0;
  changeTo: string = '';
  excelfile: any;
  members: Member[] = [];
  @ViewChild('closebutton') closebutton;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataList: IConsumerRequestList[] = [];
  isChecked: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private service: SmartMeterService,
    private toaster: ToastrService,
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

      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };
    this.getList();
    this.getMembers();
  }

  checkuncheckall() {
    if (this.isChecked == true) {
      this.isChecked = false;
      this.dataList.map((opt) => (opt.isChecked = false));
    } else {
      this.isChecked = true;
      this.dataList.map((opt) => (opt.isChecked = true));
    }
  }

  deleteSelected() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete these requests !',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',

      confirmButtonText: 'Yes, Accept it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = this.dataList
          .filter((opt) => opt.isChecked)
          .map((opt) => opt.requestID);
        let requestIDs = data.join(',');
        this.service.deleteRequest(requestIDs, 'Delete', '').subscribe(
          (res: any) => {
            
            this.toaster.success(res.message);
            this.getList();
          },
          (err) => {
            
          }
        );
      }
    });
  }
  rejectSelected() {
    Swal.fire({
      title: 'Are you sure?',

      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },

      text: 'You want to reject these requests. please enter your reject reason !',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',

      confirmButtonText: 'Yes, Accept it!',
    }).then((result) => {
      ;
      if (result.isConfirmed) {
        let data = this.dataList
          .filter((opt) => opt.isChecked)
          .map((opt) => opt.requestID);
        let requestIDs = data.join(',');
        this.service
          .deleteRequest(requestIDs, 'Reject', result.value)
          .subscribe(
            (res: any) => {
             
              this.toaster.success(res.message);
              this.getList();
            },
            (err) => {
              
            }
          );
      }
    });
  }
  acceptSelected() {
    Swal.fire({
      title: 'Are you sure?',

      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },

      text: 'You want to accept these requests. please enter your accept reason !',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Accept it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = this.dataList
          .filter((opt) => opt.isChecked)
          .map((opt) => opt.requestID);
        let requestIDs = data.join(',');
        this.service
          .deleteRequest(requestIDs, 'Accept', result.value)
          .subscribe(
            (res: any) => {             
              this.toaster.success(res.message);
              this.getList();
            },
            (err) => {
              
            }
          );
      }
    });
  }
  getList() {
    
    this.service.getAllUpdateRequest().subscribe(
      (res: any) => {
        this.dataList = res.data;
        this.dtTrigger.next();
        
      },
      (err) => {
        
      }
    );
  }
  uploadFile() {
    
    this.service
      .ExcelUploadCustomerData(this.excelfile, this.changeTo, this.assignTo)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.closebutton.nativeElement.click();
            this.toaster.success(res.message);
            
          } else {
            
            this.toaster.error(res.message);
          }
        },
        (err) => {
          
          this.toaster.error(err.message);
        }
      );
  }

  onChange(data: any) {
    let file = data.target.files;
    this.excelfile = file.item(0);
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }
}
