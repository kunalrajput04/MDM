import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { ICustomHoliday, IPrepayConfig } from 'src/app/Model/iprepay-config';
import { AuthService } from 'src/app/Service/auth.service';
import { PrepayService } from 'src/app/Service/prepay.service';

@Component({
  selector: 'app-pre-pay-config',
  templateUrl: './pre-pay-config.component.html',
  styleUrls: ['./pre-pay-config.component.css'],
})
export class PrePayConfigComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'Happy Hours Settings',
    url: '/mdm/prepaid',
  };

  customHoliday: ICustomHoliday[] = [];
  holidayData: ICustomHoliday = {
    holidayName: '',
    holidayDate: '',
    holiDayID: 0,
  };
  formData: IPrepayConfig = {
    balanceLimit: 0,
    balanceUpdateTime: '',
    fri: false,
    happyHourEnd: '',
    happyHourStart: '',
    mon: false,
    prepayID: 0,
    sat: false,
    sun: false,
    thur: false,
    tue: false,
    wed: false,
  };
  constructor(
    private service: PrepayService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService
    ) {
      this.authservice.chagneHeaderNav(this.datas);
    }
  ngOnInit(): void {
    this.getPrepayConfig();
    this.getHolidayList();
  }

  manageRequest() {
    ;
    
    
  
    this.service.managePrepayDetails(this.formData).subscribe(
      (res: any) => {
        
        this.toastr.success(res.message);
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
  addCustomeHoliDay() {
    
    this.service.manageHoliday(this.holidayData).subscribe(
      (res: any) => {
        this.toastr.success(res.message);
        this.getHolidayList();
        this.clearForm();
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  removeCustomeHoliDay(data: any) {
    
    this.service.deleteHoliday(data).subscribe(
      (res: any) => {
        this.toastr.success(res.message);
        this.getHolidayList();

        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
  getPrepayConfig() {
    
    this.service.getPrepayDetails().subscribe(
      (res: any) => {
        if(res.success==true && res.data!=null){
          this.formData = res.data;
          
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  getHolidayList() {
    
    this.service.getHolidayList().subscribe(
      (res: any) => {
        this.customHoliday = res.data;

        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
  clearForm() {
    this.holidayData = {
      holidayName: '',
      holidayDate: '',
      holiDayID: 0,
    };
  }
}
