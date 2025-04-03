import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { NewTarriflist } from 'src/app/Model/new-tarrif';
import { AuthService } from 'src/app/Service/auth.service';
import { PrepaidService } from 'src/app/Service/prepaid.service';

@Component({
  selector: 'app-new-tarrif-list',
  templateUrl: './new-tarrif-list.component.html',
  styleUrls: ['./new-tarrif-list.component.css'],
})
export class NewTarrifListComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Prepaid Service',
    levelurl: '',
    menuname: 'New Tarrif',
    url: '/mdm/PrepaidService/',
  };

  datalist: NewTarriflist[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private service: PrepaidService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authservice: AuthService,
    private datepipe: DatePipe
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
    
    this.service.GetAllNewTariff().subscribe((res: any) => {
      if (res.success == true) {
        this.datalist = res.data;
        this.dtTrigger.next(0);
        
      } else {
        
        this.toastr.error(res.message);
      }
    });
  }

  rerender(): void {
    this.onList();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  Delete(data: any) {
    
    this.service.DeleteNewTarrif(data).subscribe((res: any) => {
      
      if (res.success == true) {
        this.toastr.success(res.message);
        this.rerender();
      } else this.toastr.error(res.message);
    },
    (err) => {
      
      if (err.status == 400) this.toastr.error(err);
    });
  }

  Activate(data: any) {
    
    this.service.ActiveTarrif(data).subscribe((res: any) => {
      
      if (res.success == true) {
        this.toastr.success(res.message);
        this.rerender();
      } else this.toastr.error(res.message);
    },
    (err) => {
      
      if (err.status == 400) this.toastr.error(err);
    });
  }
}
