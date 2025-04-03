import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PaymentViewModel } from 'src/app/Model/payment';
import { AuthService } from 'src/app/Service/auth.service';
import { RazorPayService } from 'src/app/Service/razor-pay.service';
import { WindowRefService } from 'src/app/window-ref.service';

@Component({
  selector: 'app-prepaid-payment',
  templateUrl: './prepaid-payment.component.html',
  styleUrls: ['./prepaid-payment.component.css'],
})
export class PrepaidPaymentComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Recharge History',
    url: '/mdm/revenue/',
  };

  //#endregion

  datalist: PaymentViewModel[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private service: RazorPayService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.onList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
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

  onList() {
    
    this.service.getAllTranscation().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.datalist = res.data;

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
}
