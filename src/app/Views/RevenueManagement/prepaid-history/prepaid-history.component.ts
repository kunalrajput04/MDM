import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { Payment } from 'src/app/Model/payment';
import { PrepaidPostpaid } from 'src/app/Model/prepaid-postpaid';
import { AuthService } from 'src/app/Service/auth.service';
import { InstantDemandService } from 'src/app/Service/instant-demand.service';
import { RazorPayService } from 'src/app/Service/razor-pay.service';
import { WindowRefService } from 'src/app/window-ref.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prepaid-history',
  templateUrl: './prepaid-history.component.html',
  styleUrls: ['./prepaid-history.component.css'],
  providers: [WindowRefService],
})
export class PrepaidHistoryComponent implements OnInit {

  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Prepaid Consumer',
    url: '/mdm/revenue/',
  };

  //#endregion

  IsTrns: boolean = false;
  IsList: boolean = true;
  datalist: PrepaidPostpaid[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  razor: Payment = {
    cNo: '',
    Tid: '',
    amt: 0,
    status: ''
     
  };

  constructor(
    private winRef: WindowRefService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: InstantDemandService,
    private payment: RazorPayService,
    private authservice: AuthService,
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    this.onList();
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

  onList() {
    
    this.service.getPrepaidPostpaid('prepaid').subscribe(
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

  getTransactions() {
    this.IsTrns = true;
    this.IsList = false;
  }
  getList() {
    this.IsTrns = false;
    this.IsList = true;
  }

  
  payWithRazor(data: any) {
    const options: any = {
      key: 'rzp_test_ip5uFtGBWWuVNW',
      amount: 5000, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'MDM', // company name or product name
      description: '', // product description
      image: '/assets/images/MeECLlogo.png', // company logo or product image
      //order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#90EE90',
      },
    };
    options.handler = (response, error) => {
      options.response = response;
      if (response.razorpay_payment_id != null) {
        console.log(response);
        console.log(options);
        this.razor.Tid = response.razorpay_payment_id;
        this.razor.amt = options.amount;
        this.razor.status = 'SUCCESS';
        this.razor.cNo = data;
        this.makePayment(this.razor);
      } else {
        Swal.fire({
          icon: 'error',

          text: 'Oops!! Payment Getway Not responding',
        });
      }
      this.toastr.error('Oops!! something went wrong');
      // console.log(response);
      // console.log(options);
      // call your backend api to verify payment signature & capture transaction
    };
    options.modal.ondismiss = () => {
      // handle the case when user closes the form while transaction is in progress
      this.toastr.error('Transactions Cancelled');
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  makePayment(data: Payment) {
    this.payment.makePayment(data).subscribe(
      (res: any) => {
      if (res.success == true) {
        Swal.fire({
          imageUrl: '/assets/images/MeECLlogo.png',
          imageHeight: 100,
          imageAlt: 'A tall image',
          title: 'Congrats!!',

          text: 'Payment Received Successfully',
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Oops!! Payment Getway Not responding',
        });
      }
    });
  }


}
