import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { IConfigServiceService } from 'src/app/Service/iconfig-service.service';

import { ToastrService } from 'ngx-toastr';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';

@Component({
  selector: 'app-add-config',
  templateUrl: './add-config.component.html',
  styleUrls: ['./add-config.component.css'],
})
export class AddConfigComponent implements OnInit {
  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Instant Demand Service',
    levelurl: '',
    menuname: 'New Configuration',
    url: '/mdm/prepaid',
  };

  
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  consumerno: any[] = [];

  subdivisonName: string = '';
  substationName: string = '';
  feederName: string = '';
  dtName: string = '';
  meterNo: string;

  demandIntegration: string = '900';
  loadLimit: string = '';
  meteringMode: string = '';
  profileCaptured: string = '900';
  enableDisableDisconnectControl: string = '0';
  CoverOpen: string = 'Y';
  AlertIPPush: string = '[2400:5300:1::711]:4059';
  InstantIPPush: string = '[2400:5300:1::711]:4059';
  ActivitySchedulePush: string = '00:31:00,06:30:00,12:30:00,18:30:00';
  BillingDatesValue: string = '';
  todTime: string;
  todDate: string;
  requestType: string = 'All';
  requestValue: string = localStorage.getItem('AccessValue');
  currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');

  loading: boolean = false;
  virtualScroll: boolean = true;
  PaymentMode: string;
  constructor(
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private datePipe: DatePipe,
    private config: IConfigServiceService,
    private toaster: ToastrService,
    private storeservice: SmartMeterService
  ) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {

    this.getSubdivision();
  }

  changeLevel() {
    
    if (this.requestType == 'Consumer') {
      this.requestValue = this.meterNo;
    }
    else if (this.requestType == 'SUBDEVISION') {
      this.requestValue = this.subdivisonName;
    }
    else if (this.requestType == 'SUBSTATION') {
      this.requestValue = this.substationName;
    }
    else if (this.requestType == 'FEEDER') {
      this.requestValue = this.feederName;
    }
    else if (this.requestType == 'DT') {
      this.requestValue = this.dtName;
    }
    else if (this.requestType == 'All') {
      this.requestValue = localStorage.getItem('AccessValue');
    }

  }

  getSubdivision() {
    

    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
     
        
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
        
      
    });
  }

  getSubstation() {
    
    this.substation
      .getSubstationBySubdivision(this.subdivisonName)
      .subscribe((res: any) => {
        
        this.substatioDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
      
      });
  }
  getFeeder() {
    
    this.feederservice
      .getFeederBySubstation(this.substationName)
      .subscribe((res: any) => {
        
        this.feederDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        
      });
  }
  getDT() {
    
    this.dtservice.getDTByFeeder(this.feederName).subscribe((res: any) => {
      
      this.dtDropDown = [];
     
        
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
     
    });
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
        (err) => {

        }
      );
    }
  }
  onSubmit(command: string) {
    
    this.changeLevel();
    let commandValue;
    if (command == 'RTCClock') {
      commandValue = '';
    } else if (command == 'DemandIntegrationPeriod') {
      commandValue = this.demandIntegration;
    } else if (command == 'LoadLimit') {
      commandValue = this.loadLimit;
    } else if (command == 'MeteringMode') {
      commandValue = this.meteringMode;
    } else if (command == 'ProfileCapturePeriod') {
      commandValue = this.profileCaptured;
    } else if (command == 'EnableDisableDisconnectControl') {
      commandValue = this.enableDisableDisconnectControl;
    } else if (command == 'CoverOpen') {
      commandValue = this.CoverOpen;
    }
    else if (command == 'AlertIPPush') {
      commandValue = this.AlertIPPush;
    }
    else if (command == 'ActivitySchedulePush') {
      commandValue = this.ActivitySchedulePush;
    }
    else if (command == 'InstantIPPush') {
      commandValue = this.InstantIPPush;
    }
    else if (command == 'MdReset') {
      commandValue = 45;
    }
    else if (command == 'BillingDates') {
      commandValue = this.BillingDatesValue;
    }
    else if (command == 'ActivityCalendar') {
      commandValue = this.todTime + '|' + this.datePipe.transform(this.todDate, 'yyyy-MM-dd hh:mm:ss');
    }
    else if (command == 'PaymentMode') {
      commandValue = this.PaymentMode;
    }
    this.config
      .executeCommandForConfiguration(
        command,
        commandValue,
        this.requestType,
        this.requestValue
      )
      .subscribe((res: any) => {
        

        if (res.data != null) {
          if (res.data == true) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.success('Something went wrong !!');
          }
        }
      });
  }

}
