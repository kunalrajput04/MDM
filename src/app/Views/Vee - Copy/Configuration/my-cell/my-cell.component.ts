import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  IAfterGuiAttachedParams,
  ICellRendererParams,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { VeeService } from 'src/app/Service/vee.service';
import { DialogElementComponent } from './dialog-element/dialog-element.component';

@Component({
  selector: 'app-my-cell',
  template: `
    <button
      type="button"
      *ngIf="isNew == true"
      (click)="onEditClick()"
      data-action-type="view"
      class="btn btn-primary mx-1"
    >
      Edit
    </button>

    <button
      type="button"
      *ngIf="isNew == true"
      (click)="deleteRecord()"
      data-action-type="view"
      class="btn btn-primary mx-1"
    >
      Delete
    </button>

    <!-- <button
      type="button"
      *ngIf="isNew == true"
      (click)="openDialog()"
      data-action-type="view"
      class="btn btn-primary"
    >
      View
    </button> -->
  `,
  styles: [
    `
      .btn {
        line-height: 0.5;
      }
    `,
  ],
})
export class MyCellComponent implements OnInit, ICellRendererAngularComp {
  public params: any;
  public isNew: any;
  public previousData: any;
  constructor(
    private route: Router,
    private veesr: VeeService,
    private toster: ToastrService,
    public dialog: MatDialog
  ) {
    this.isNew = true;
  }
  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // throw new Error('Method not implemented.');
  }

  public invokeParentMethod() {
    // this.params.context.componentParent.methodFromParent(
    // `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`
    // );
  }

  ngOnInit(): void {
    console.log(this.params.data);
  }
  onEditClick() {
    this.route.navigate(['mdm', 'vee', 'EditValidationRule'], {
      state: { from: 'edit', with: this.params.data },
    });
  }
  deleteRecord() {
    this.params.clicked({ from: 'delete', data: this.params.data });
  }
  
  openDialog() {
    this.dialog.open(DialogElementComponent, { data: this.params.data });
  }
}
