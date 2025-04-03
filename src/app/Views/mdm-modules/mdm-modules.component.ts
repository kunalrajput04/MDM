import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { SignalrService } from 'src/app/Service/signalr.service';
import Swal from 'sweetalert2';
export interface IPermission {
  isconsumer: boolean;
  isWealth: boolean;
  isUser: boolean;
  isRevenue: boolean;
  isAssets: boolean;
  isMeter: boolean;
  isEnergy: boolean;
  isCustomer: boolean;
  isPrepaidService: boolean;
  isException: boolean;
  isPrepaid: boolean;
  isVee: boolean;
  isCommunication: boolean;
  isAnyEvents: boolean;
}
@Component({
  selector: 'app-mdm-modules',
  templateUrl: './mdm-modules.component.html',
  styleUrls: ['./mdm-modules.component.css'],
})
export class MdmModulesComponent implements OnInit {
  permission: IPermission = {
    isAssets: false,
    isPrepaidService: false,
    isconsumer: false,
    isWealth: false,
    isUser: false,
    isRevenue: false,
    isMeter: false,
    isEnergy: false,
    isCustomer: false,
    isCommunication: false,
    isException: false,
    isPrepaid: false,
    isVee: false,
    isAnyEvents: false,
  };
  loginUserName: string = localStorage.getItem('Name');
  levelValue: string = localStorage.getItem('AccessValue');
  levelName: string = localStorage.getItem('AccessLevel');
  constructor(
    private router: Router,
    private service: UserService,
    private authserv: AuthService,
    private spinner: NgxSpinnerService,
    private signalRService: SignalrService
  ) {}

  ngOnInit(): void {
    this.getPermission();
    if (this.levelName == 'ALL') this.levelValue = 'ALL';
    this.signalRService.startConnection(this.levelValue);
    this.signalRService.eventRecived$.subscribe((data) => {
     // this.getEventRequest(data);
    });
  }
  logout() {
    this.authserv.logout().subscribe(
      (res: any) => {},
      (err) => {}
    );
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  getPermission() {
    this.service.getModulePermission().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.permission = res.data;
        }
      },
      (err) => {
        this.router.navigate(['/auth/login']);
      }
    );
  }
  getEventRequest = (data) => {
   
    Swal.fire({
      position: 'bottom-end',
      icon: 'success',
      title: data,
      showConfirmButton: true,
    });
  };
}
