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
  selector: 'app-dailyCell',
  template: `
    <button
      type="button"
      (click)="onActionClick()"
      class="ag-grid btn btn-primary text-center"
    >
    Run Estimation
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
export class MyDailyCellComponent2 implements OnInit, ICellRendererAngularComp {
  public params: any;
  public isNew: any;
  gridApi: any;
  meterSo = [];
  materSt = [];
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
    console.log(this.params.data)
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

  onActionClick() {

  console.log("Hello")
    
  } 
  // else{
  //   console.log(this.params?.data?.MeterType)

  //   this.veesr.singlePHDailyData({outputId:this.params.data.Id}).subscribe((res:any)=>
  //   {
  //     console.log(res,{outputId:this.params.data.Id});

      // this.params.clicked({data:this.params.data}); 
      // const csvData = this.convertToCSV(res);
      // const fileName = 'data.csv';
  
      // const blob = new Blob([csvData],{ type: 'text/csv;charset=utf-8;'});
  
      //   const link = document.createElement('a');
        // if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
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
      console.log(data)
      data.map((a:any)=>{
        console.log(a.status)
        delete (a.status)
        return a;
       })
      const headerRow = Object.keys(data[0] || {}).join(','); 
      console.log(data)
      const rows = data?.map((item) => Object.values(item).join(','));
      return `${headerRow}\n${rows?.join('\n')}`;
}
}
      
  

  



