import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { ConsumerUpdateRequest } from 'src/app/Model/iservice-request';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Service Order',
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
  datalist: ConsumerUpdateRequest[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private service: PrepaidService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authservice: AuthService,
    private datepipe: DatePipe,
    private userservice: UserService,
    private smart: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.onList();
    this.getMembers();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,
      order: [],
      retrieve: true,
      destroy: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };
  }

  onList() {
    this.service.GetConsumerUpdateRequestList().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.datalist = res.data;
          this.dtTrigger.next(0);
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  rerender(): void {
    this.onList();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  manage(Id: number, status: string, consumerno: string, changeto: string) {
    this.service
      .ConsumerUpdatebyStatus(Id, status, consumerno, changeto)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this.toastr.success(res.message);
            this.rerender();
          } else this.toastr.error(res.message);
        },
        (err) => {
          if (err.status == 400) this.toastr.error(err);
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

  uploadFile() {
    this.smart
      .ExcelUploadCustomerData(this.excelfile, this.changeTo, this.assignTo)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.closebutton.nativeElement.click();
            this.toastr.success(res.message);

            this.rerender();
          } else {
            this.toastr.error(res.message);
          }
        },
        (err) => {
          this.toastr.error(err.message);
        }
      );
  }
}
