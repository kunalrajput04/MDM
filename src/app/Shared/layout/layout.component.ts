import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgToggleButton } from 'ag-grid-community';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { IMenu } from 'src/app/Model/imenu';
import { AuthService } from 'src/app/Service/auth.service';
import { SignalrService } from 'src/app/Service/signalr.service';
import { environment } from 'src/environments/environment';
import { navMenu } from '../navmenu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isExpended: boolean = true;
  
  navMenu: IMenu[] = [];
  data: HeaderMenu = new HeaderMenu();
  loginUserName: string = localStorage.getItem('Name');
  currentUrl: string = '';
  version: string = environment.mdmVersion;
  constructor(private router: Router, private service: AuthService) {
    this.service.currentheadernav.subscribe((data) => {
      this.data = data;
    });


    if (this.router.url.indexOf('/mdm/user') > -1) {
      this.navMenu = navMenu.userModule;
    } else if (this.router.url.indexOf('/mdm/consumer') > -1) {
      this.navMenu = navMenu.consumerModule;
      console.log(this.navMenu);
    } else if (this.router.url.indexOf('/mdm/assets') > -1) {
      
      if (localStorage.getItem('AccessLevel') == 'All' || localStorage.getItem('AccessLevel') == 'ALL')
        this.navMenu = navMenu.assetsModule;
      else if (localStorage.getItem('AccessLevel') == 'SUBDEVISION')
        this.navMenu = navMenu.assetsModuleForSubdivision;
      else if (localStorage.getItem('AccessLevel') == 'SUBSTATION')
        this.navMenu = navMenu.assetsModuleForSubstation;
      else if (localStorage.getItem('AccessLevel') == 'FEEDER')
        this.navMenu = navMenu.assetsModuleForFeeder;
      else if (localStorage.getItem('AccessLevel') == 'DT')
        this.navMenu = navMenu.assetsModuleForDt;
    } else if (this.router.url.indexOf('/mdm/support') > -1) {
      this.navMenu = navMenu.supportModule;
    } else if (this.router.url.indexOf('/mdm/PrepaidService') > -1) {
      this.navMenu = navMenu.PrepaidServiceModule;
    } else if (this.router.url.indexOf('/mdm/meterdata') > -1) {
      this.navMenu = navMenu.meterDataModule;
    } else if (this.router.url.indexOf('/mdm/revenue') > -1) {
      this.navMenu = navMenu.revenueModule;
    } else if (this.router.url.indexOf('/mdm/prepaid') > -1) {
      this.navMenu = navMenu.prepaidModule;
    } else if (this.router.url.indexOf('/mdm/vee') > -1) {
      this.navMenu = navMenu.veeModule;
    } else if (this.router.url.indexOf('/mdm/exception') > -1) {
      this.navMenu = navMenu.exceptionModule;
    } else if (this.router.url.indexOf('/mdm/energy') > -1) {
      this.navMenu = navMenu.energyModule;
    }
    else if (this.router.url.indexOf('/mdm/communication') > -1) {
      this.navMenu = navMenu.communicationModule;
    }
   
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;   
  }
  logout() {
    this.service.logout().subscribe(
      (res: any) => {
      },
      (err) => {
      }
    );
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  } 
  
  manageSideNav() {
  this.isExpended=!this.isExpended
  }
}
