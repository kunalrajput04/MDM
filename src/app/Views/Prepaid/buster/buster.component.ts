import { Component, OnInit } from '@angular/core';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';

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

  //#endregion

  IsAdd: boolean = false;
  IsList: boolean = true;
  constructor(private authservice: AuthService) {
    this.authservice.chagneHeaderNav(this.datas);
  }

  ngOnInit(): void {}

  Add() {
    this.IsAdd = true;
    this.IsList = false;
  }
  List() {
    this.IsList = true;
    this.IsAdd = false;
  }
}
