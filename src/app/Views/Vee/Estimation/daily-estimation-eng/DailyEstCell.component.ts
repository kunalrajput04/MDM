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

@Component({
  selector: 'app-my-cell',
  template: `
    <button
      type="button"
      *ngIf="isNew == true"
      (click)="passedRecord()"
      data-action-type="view"
      class="btn btn-primary mx-1"
    >
      Passed
    </button>

    <button
      type="button"
      *ngIf="isNew == true"
      (click)="failedRecord()"
      data-action-type="view"
      class="btn btn-primary mx-1"
    >
      Failed
    </button>
  `,
  styles: [
    `
      .btn {
        line-height: 0.5;
      }
    `,
  ],
})
export class MyDailyESTCellComponent
  implements OnInit, ICellRendererAngularComp
{
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
  passedRecord() {
    // this.route.navigate(['mdm', 'vee', 'EditestimationRule'], {
    //   state: { from: 'pass', with: this.params.data },
    // });
    this.params.clicked({ from: 'pass', data: this.params.data });
    let id = this.params.data.ID;
    console.log(id);
    this.veesr.DailyESTPassedReport({ ReportId: id }).subscribe((res) => {
      if (res) {
        this.toster.success('Daily Estimation rule passed Report generated');
        this.route.navigate(['mdm', 'vee', 'passedDailyReport'], {
          state: { from: 'pass', with: res },
        });
      }
    });
  }

  failedRecord() {
    this.params.clicked({ from: 'fail', data: this.params.data });
    let id = this.params.data.ID;
    console.log(id);
    this.veesr.DailyESTFailedReport({ ReportId: id }).subscribe((res) => {
      if (res) {
        this.toster.success('Daily Estimation rule failed Report generated');
        this.route.navigate(['mdm', 'vee', 'failedDailyReport'], {
          state: { from: 'fail', with: res },
        });
      }
    });
  }
}
