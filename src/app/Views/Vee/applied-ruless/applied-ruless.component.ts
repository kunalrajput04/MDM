import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { VeeRules } from 'src/app/Model/vee-rules';
import { AuthService } from 'src/app/Service/auth.service';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-applied-ruless',
  templateUrl: './applied-ruless.component.html',
  styleUrls: ['./applied-ruless.component.css'],
})
export class AppliedRulessComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'VEE',
    levelurl: '',
    menuname: '',
    url: '/mdm/vee/',
  };

  //#endregion

  isEdit: boolean = false;
  headerdata = [];
  rowdata = [];
  pageOfItems: Array<any>;
  items = [];
  searchText = null;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  rulename: string;
  formdata: VeeRules = {
    ruleName: '',
    userName: '',
    startDate: "",
    endDate: "",
  };
  constructor(
    private service: VeeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private datepipe: DatePipe
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    var date = new Date();
    console.log(this.datepipe.transform(date, 'dd-MM-yyyy:hh:mm:ss'));
    this.route.params.subscribe((res) => {
      this.rulename = res.name;
      this.datas.menuname = this.rulename;
    });

    let obj = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      dom: 'lBfrtip',
      processing: true,
      buttons: [
        { extend: 'excel', title: 'Subdivision' },

        { extend: 'pdf', title: 'Subdivision' },
        {
          text: 'Refresh',
          action: function () {},
        },
      ],
    };
  }

  getAppliedRules() {
    
    this.formdata.ruleName = this.rulename;
    this.formdata.startDate =this.datepipe.transform(this.formdata.startDate, 'dd-MM-yyyy:hh:mm:ss')
    
    this.formdata.startDate = this.datepipe.transform(this.formdata.endDate, 'dd-MM-yyyy:hh:mm:ss')
    
    this.service.getappliedRules(this.formdata).subscribe((res: any) => {
      if (res != null) {
        this.headerdata = res.data[0][1];
        this.rowdata = [];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.rowdata.push(res.data[0][item]);
          }
        }
        console.log(this.rowdata);
        console.log(this.headerdata);
        this.dtTrigger.next();
      }
    });
  }
}
