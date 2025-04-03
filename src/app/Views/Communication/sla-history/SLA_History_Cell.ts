import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  IAfterGuiAttachedParams,
  ICellRendererParams,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Service/data.service';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-slaHistoryCell',
  template: `
    <button
      type="button"
      (click)="onBtnExport()"
      class="ag-grid btn btn-primary text-center"
    >
      <i class="fa fa-download"></i>
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
export class MySLAHistoryCellComponent
  implements OnInit, ICellRendererAngularComp
{
  public params: any;
  public isNew: any;
  gridApi: any;
  public previousData: any;
  pdfData: any[] = [];
  pdfLink: any;

  constructor(
    private route: Router,
    private service: DataService,
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
    console.log(this.params.data);
  }

  ngOnInit(): void {}

  onBtnExport() {
    console.log(this.params.data);
    this.service.slaDataOfHistory(slaData).subscribe((res: any) => {
    //  console.log(res.data);
      this.pdfData = [];
      Object.values(res.data[0]).map((data, k, arr: any) => {
        if (k !== 0) {
          const d = {};
          arr[0].map((k, key) => {
            d[k] = data[key];
          });
          this.pdfData.push(d);
          this.pdfData.map((r: any) => {
            console.log(r.pdflink);
            this.pdfLink = r.pdflink;
            console.log(this.pdfLink);
          });
        }
      });
     // console.log(this.pdfData, this.pdfLink);
    });
    const url = this.pdfLink;
    // Assuming the PDF link is in the 'value' field
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file.pdf';
    link.target = '_blank';
    link.click();
  }
}
const slaData = {
  level_name: 'ALL',
  level_value: 'MPDCL',
  start_date: '2020-01-01',
  end_date: '2030-12-31',
};
