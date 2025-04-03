import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `<button *ngIf="!isModal" type="button" [style.background-color]="color" class="btn btn-primary" style="font-size: 13px;padding: 2px 24px 9px;color:white;" (click)="onClick($event)">{{label}}</button><button  *ngIf="isModal" data-toggle="modal" data-target="#myModal" type="button" [style.background-color]="color" class="btn btn-primary" style="font-size: 13px;padding: 2px 24px 9px;color:white;" (click)="onClick($event)">{{label}}</button>`
})
export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;
  color: string = 'red';
  isModal: boolean = false;
  agInit(params): void {

    this.params = params;
    this.label = this.params.label || null;
    this.color = this.params.color || 'blue';
    this.isModal = this.params.isModal || false;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}
