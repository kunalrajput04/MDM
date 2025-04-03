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
  selector: 'app-monthlyCell',
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
export class MyMonthlyCellComponent
  implements OnInit, ICellRendererAngularComp
{
  public params: any;
  public isNew: any;
  gridApi: any;
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
    console.log(this.params.data);
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // throw new Error('Method not implemented.');
  }

  public invokeParentMethod() {
    // this.params.context.componentParent.methodFromParent(
    // `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`
    // );
  }

  ngOnInit(): void {}

  onBtnExport() {
    var excelParams = {
      fileName: 'NewEvents.csv',
    };
    this.gridApi?.exportDataAsCsv(excelParams);

    console.log(this.params.data.id); //Particular cell details
    console.log(this.params.data.meterType);

    // if(this.params.data.MeterType !== 'single phase'){

    let m = this.params.data.meterType;
    let d = this.params.data.id
    this.veesr
      .MixedPHMonthlyData({
        montlyValidationReportID:d,
        meterType:m,
      })
      .subscribe((res: any) => {
        console.log(res);

        // this.params.clicked({data:this.params.data});
        const csvData = this.convertToCSV(res);
        const fileName = 'data.csv';

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
    }
    //   else{
    //     console.log('Single phase', 'else')
    //     this.veesr.singlePHMonthlyData({outputId:this.params.data.Id}).subscribe((res:any)=>
    //     {
    //       console.log(res,{outputId:this.params.data.Id});

    //       // this.params.clicked({data:this.params.data});
    //       const csvData = this.convertToCSV(res);
    //       const fileName = 'data.csv';

    //       const blob = new Blob([csvData],{ type: 'text/csv;charset=utf-8;'});

    //         const link = document.createElement('a');
    //         if (link.download !== undefined) {
    //           // Browsers that support HTML5 download attribute
    //           const url = URL.createObjectURL(blob);
    //           link.setAttribute('href', url);
    //           link.setAttribute('download', fileName);
    //           link.style.visibility = 'hidden';
    //           document.body.appendChild(link);
    //           link.click();
    //           document.body.removeChild(link);
    //         }
    //     })
    //   }
    // }
  
  convertToCSV(data) {
    const headerRow = Object.keys(data[0] || {}).join(',');
    const rows = data?.map((item) => Object.values(item).join(','));
    return `${headerRow}\n${rows?.join('\n')}`;
  }
}
