import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChartTable } from '../Model/dash-board';
import { Headernavigation } from '../Model/smart-meter';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  constructor() { }

  data: Headernavigation = new Headernavigation();
  private headernav = new BehaviorSubject(this.data);
  currentheadernav = this.headernav.asObservable();
  private weekdropdown = new BehaviorSubject('Yesterday');
  currentweekdropdown = this.weekdropdown.asObservable();
  private datetime = new BehaviorSubject('');
  datetimevar = this.datetime.asObservable();

  chartTable: IChartTable = {
    commandType: null,
    daytype: null,
    status: null
  };
  private shareChartTable = new BehaviorSubject(this.chartTable);
  shareChartData = this.shareChartTable.asObservable();

  chagneHeaderNav(data: Headernavigation) {
    this.headernav.next(data);
  }
}
