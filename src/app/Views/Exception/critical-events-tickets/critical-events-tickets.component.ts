import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { SupportInfo } from 'src/app/Model/support';
import { AuthService } from 'src/app/Service/auth.service';
import { SupportService } from 'src/app/Service/support.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-critical-events-tickets',
  templateUrl: './critical-events-tickets.component.html',
  styleUrls: ['./critical-events-tickets.component.css'],
})
export class CriticalEventsTicketsComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Exception',
    levelurl: '',
    menuname: 'Raised Tickets',
    url: '/mdm/exception/tickets',
  };

  supportlist: SupportInfo[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private service: SupportService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.getList();
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
  }

  getList() {
    this.service.getAll().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.supportlist = res.data;
          this.dtTrigger.next();
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
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.getList();
  }
  closeSupport(id) {
    let refid = id;
    Swal.fire({
      title: 'Are you sure want to close this complaint?',

      inputAttributes: {
        autocapitalize: 'off',
      },
      text: '',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.closeComplaint(refid).subscribe((res: any) => {
          Swal.fire(res.message, '', 'success');
          this.rerender();
        });
      }
    });
  }
}
