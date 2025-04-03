import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IBoosterList } from 'src/app/Model/ibooster-list';
import { AuthService } from 'src/app/Service/auth.service';
import { BoosterServiceService } from 'src/app/Service/booster-service.service';

@Component({
  selector: 'app-buster',
  templateUrl: './buster.component.html',
  styleUrls: ['./buster.component.css'],
})
export class BusterComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Booster',
    url: '/mdm/prepaid',
  };

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  rowdata: IBoosterList[] = [];
  constructor(
    private service: BoosterServiceService,
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

  onList() {
    this.service.getAllBooster().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.rowdata = res.data;
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
