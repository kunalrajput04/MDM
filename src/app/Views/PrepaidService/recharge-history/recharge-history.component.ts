import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PaymentViewModel } from 'src/app/Model/payment';
import { DataFilter, MyDataFilter, PrepaidRecharge } from 'src/app/Model/prepaid-recharge';
import { AuthService } from 'src/app/Service/auth.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';
import { RazorPayService } from 'src/app/Service/razor-pay.service';

@Component({
  selector: 'app-recharge-history',
  templateUrl: './recharge-history.component.html',
  styleUrls: ['./recharge-history.component.css'],
})
export class RechargeHistoryComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Prepaid Service',
    levelurl: '',
    menuname: 'Recharge History',
    url: '/mdm/PrepaidService/',
  };

  formdata: MyDataFilter=new MyDataFilter();

  datalist: PrepaidRecharge[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private service: PrepaidService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authservice: AuthService,
    private datepipe:DatePipe
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {

    let date = new Date();
    date.setDate(date.getDate() - 6);
    this.formdata.from = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.formdata.to = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    this.onList();
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
    
    this.service.GetAllRecharges(this.formdata).subscribe((res: any) => {
      if (res.success == true) {
        this.datalist = res.data;
        this.dtTrigger.next(0);
        
      } else {
        
        this.toastr.error(res.message);
      }
    });
  }

  onSubmit() {
    
    this.rerender();
  }

  rerender(): void {
    ;
    this.onList();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }
}
