import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AccessLevel } from 'src/app/Model/access-level';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { ExceptionServiceService } from 'src/app/Service/exception-service.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css'],
})
export class ExceptionComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Exception',
    levelurl: '',
    menuname: 'Event Log',
    url: '/mdm/exception/',
  };

  //#endregion

  formData: AccessLevel = {
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
    accessLevel: 'Consumer',
  };
  accessLevel: string =
    localStorage.getItem('AccessLevel') == 'ALL'
      ? 'All'
      : localStorage.getItem('AccessLevel');
  accessValue: string = localStorage.getItem('AccessValue');

  formdata: MeterData = new MeterData();
  headerdata = [];
  rowdata = [];
  isSubmit: boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  isRender: boolean = false;

  consumerno: any[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private exeservice: ExceptionServiceService,
    private authservice: AuthService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {
    let obj = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Event Data' },

        { extend: 'pdf', title: 'Event Data' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender(obj.formdata.fromdate, obj.formdata.todate);
          },
        },
      ],
    };

    let date = new Date();
    date.setDate(date.getDate() - 3);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  getConsumers(data: any) {
    let consumernumber = data.target.value;
    if (consumernumber.length > 3) {
      this.loading = true;
      this.storeservice.getConsumerWithMeterNo(consumernumber).subscribe(
        (res: any) => {
          this.consumerno = res.data;
          this.loading = false;
        },
        (err) => {}
      );
    }
  }

  getEventData(from: any, to: any) {
    let accesslevel;
    let accessvalue;
    if (this.formData.accessLevel == '') {
      accesslevel = this.accessLevel;
      accessvalue = this.accessValue;
    } else if (
      this.formData.accessLevel == 'All' ||
      this.formData.accessLevel == 'ALL'
    ) {
      accessvalue = 'All';
    } else if (this.formData.accessLevel == 'SUBDEVISION') {
      accesslevel = 'SUBDEVISION';
      accessvalue = this.formData.subdivisonName;
    } else if (this.formData.accessLevel == 'SUBSTATION') {
      accesslevel = 'SUBSTATION';
      accessvalue = this.formData.substationName;
    } else if (this.formData.accessLevel == 'FEEDER') {
      accesslevel = 'FEEDER';
      accessvalue = this.formData.feederName;
    } else if (this.formData.accessLevel == 'DT') {
      accesslevel = 'DT';
      accessvalue = this.formData.dtName;
    }

    if (from == null && to == null) {
      from = new Date();
      to = new Date();
    } else {
      from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
      to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');

      this.exeservice
        .getEventData(from, to, this.formdata.meterNo, accesslevel, accessvalue)
        .subscribe((res: any) => {
          this.headerdata = res.data[0][1];

          this.rowdata = [];
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.rowdata.push(res.data[0][item]);
            }
          }

          this.dtTrigger.next();
        });
    }
  }

  rerender(from: any, to: any): void {
    if (this.isRender) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
    this.getEventData(from, to);
  }

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
    this.rerender(this.formdata.fromdate, this.formdata.todate);
  }

  getSubdivision() {
    if (this.accessLevel == 'All' || this.accessLevel == 'ALL') {
      this.subdivisionservice.getSubdivision().subscribe((res: any) => {
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      });
    } else if (this.accessLevel == 'SUBDEVISION') {
      this.substation
        .getSubstationBySubdivision(this.accessValue)
        .subscribe((res: any) => {
          this.substatioDropDown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.substatioDropDown.push(obj[item][0]);
            }
          }
        });
    } else if (this.accessLevel == 'SUBSTATION') {
      this.feederservice
        .getFeederBySubstation(this.accessValue)
        .subscribe((res: any) => {
          this.feederDropDown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.feederDropDown.push(obj[item][0]);
            }
          }
        });
    } else if (this.accessLevel == 'FEEDER') {
      this.dtservice.getDTByFeeder(this.accessValue).subscribe((res: any) => {
        this.dtDropDown = [];

        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      });
    }
  }
  getSubstation(subdivision: string) {
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        this.substatioDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getFeeder(substation: string) {
    this.feederservice
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        this.feederDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getDT(feeder: string) {
    this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
      this.dtDropDown = [];

      let obj = res.data[0];
      for (var item in obj) {
        this.dtDropDown.push(obj[item][0]);
      }
    });
  }
}
