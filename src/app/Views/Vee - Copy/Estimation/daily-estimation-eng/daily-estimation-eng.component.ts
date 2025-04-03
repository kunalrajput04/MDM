import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { event, param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { estimationRule } from 'src/app/Model/createEstimation';
import { VeeService } from 'src/app/Service/vee.service';
import { MyDailyESTCellComponent } from './DailyEstCell.component';
@Component({
  selector: 'app-daily-estimation-eng',
  templateUrl: './daily-estimation-eng.component.html',
  styleUrls: ['./daily-estimation-eng.component.css']
})
export class DailyEstimationEngComponent implements OnInit {
  // RuleData = {};
  // // formdata: validation = {
  // //   process: 'Daily Process',
  // // };
  // formdata: estimationRule = new estimationRule();
  // dnData: any[] = [];
  // viewListData: any;
  // viewMixedListData: any;
  // viewMixedSingleData: any;

  // rule: any;
  // gridApi: any;
  // public gridColumnApi: any;
  // public columnDefs: (ColDef | ColGroupDef)[];
  // public rowData = [];
  // public defaultColDef: any;
  // public context;
  // frameworkComponents: any;
  // public editType;
  // public rowClassRules;

  // constructor(
  //   private veeService: VeeService,
  //   private toster: ToastrService
  // ) {
  //   this.defaultColDef = { resizable: true, filter: true, sortable: true };
  //   this.columnDefs = [
  //     {
  //       headerName: 'BATCH NO',
  //       field: 'id',
  //       width: 150,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //     {
  //       headerName: 'Meter No',
  //       field: 'meterNo',
  //       width: 150,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //     {
  //       headerName: 'Rule Name',
  //       field: 'ruleName',
  //       width: 150,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //     {
  //       headerName: 'Logic',
  //       field: 'logic',
  //       width: 100,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //     {
  //       headerName: 'Period',
  //       field: 'period',
  //       width: 120,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //     {
  //       headerName: 'Parameter',
  //       field: 'parameter',
  //       width: 150,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //     {
  //       headerName: 'Energy',
  //       field: 'energy',
  //       width: 130,
  //       cellStyle: { 'font-weight': '600', 'font-size': '14px' },
  //     },
  //   ];
  // }

  // cancelOtherRowEditors(currentRowIndex) {
  //   const renderers = this.gridApi.getCellRendererInstances();
  //   renderers.forEach(function (renderer) {
  //     if (
  //       !renderer._agAwareComponent?.isNew &&
  //       currentRowIndex !== renderer._params?.node.rowIndex
  //     ) {
  //       renderer._agAwareComponent?.onCancelClick();
  //     }
  //   });
  // }

  // onGridReady(params: any) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
    // this.gridApi.setRowData();
    // this.gridColumnApi.autoSizeAllColumns();
  // }

  // onCellClicked(params: any) {
  //   if (params.node.field !== 'action') {
  //     this.cancelOtherRowEditors(params.node.rowIndex);
  //   }
  // }
  // ngOnInit(): void {
    // daily singlephase
    // this.veeService.addDailyESTLoadData().subscribe((res: any) => {
    //   console.log(res, 'res');
    //   if (res || res.Data) {
    //     this.rowData =[ ...this.rowData, ...res];
    //     this.Batches.Total = this.rowData?.length;
    //     console.log(this.rowData);
    //   }
    // });

    //dropdown list data
  //   this.veeService.getEstimationList().subscribe((res1) => {
  //     console.log(res1);
  //     this.viewListData = this.checkData(res1);
  //     console.log(this.viewListData);
  //   });
  // }
 
  // checkData(data) {
  //   const finalData = {};
  //   data
  //     .filter((r) => {
  //       console.log(r.dataType);
  //       return r.dataType !== 'Billing';
  //     })
  //     .map((d) => {
  //       console.log(d);
  //       if (!finalData[d['dataType']]?.length) finalData[d['dataType']] = [];
  //       finalData[d['dataType']].push(d);
  //     });

  //   return finalData;
  // }
  // Batches = {
  //   Total: 0,
  //   Average: '0',
  //   ValidationQueue: '0',
  //   BatchQueue: '0',
  // };
  // RUN & Go************************************************************************
 
  // Run(Event: any) {
  //   console.log(Event)
  //   const currentSellection = this.viewListData?.DLP?.find(
  //     (r) => r.ruleName === Event
  //   );
  //   console.log(currentSellection,currentSellection.meterType);
  //   if (currentSellection.meterType !== 'Single phase') {
  //     let id = currentSellection.id;
  //     console.log(id)
  //     this.veeService.MonthlyESTAvgReport({}).subscribe((res) => {
  //       console.log(res);
  //       this.rowData = []
  //       // ***************************
  //       this.veeService.addDailyESTLoadData().subscribe((res: any) => {
  //         console.log(res, 'res');
  //         if (res || res.Data) {
  //           this.rowData = [...this.rowData,...res];
  //           console.log(res.Data,"descending",this.rowData)
  //           this.Batches.Total = this.rowData?.length; 
  //         } 
           
  //       //   ruleName.control.setValue('');
  //       //   ruleName.control.markAsUntouched();
  //       // });
  //       this.toster.success('Logiv Average Rule work successfully');
  //     });
   
  //   });
  // }
  //   else {
  //     this.toster.error('Logic not found');
  //   }
// }
// }


// *******************************
RuleData = {};
// formdata: validation = {
//   process: 'Daily Process',
// };
formdata: estimationRule = new estimationRule();
dnData: any[] = [];
viewListData: any;
viewMixedListData: any;
viewMixedSingleData: any;

rule: any;
gridApi: any;
public gridColumnApi: any;
public columnDefs: (ColDef | ColGroupDef)[];
public rowData = [];
public defaultColDef: any;
public context;
frameworkComponents: any;
public editType;
public rowClassRules;

constructor(
  private veeService: VeeService,
  private toster: ToastrService
) {
  this.defaultColDef = { resizable: true, filter: true, sortable: true };
  this.columnDefs = [
    {
      headerName: 'BATCH NO',
      field: 'ID',
      width: 120,
      cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    },
    {
      headerName: 'Created On',
      field: 'CreatedOn',
      width: 180,
      cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    },
    // {
    //   headerName: 'Meter No',
    //   field: 'meterNo',
    //   width: 150,
    //   cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    // },
    {
      headerName: 'Rule Name',
      field: 'RuleName',
      width: 180,
      cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    },
    {
      headerName: 'Total',
      field: 'Total',
      width: 120,
      cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    },
    {
      headerName: 'Fail',
      field: 'Failed',
      width: 100,
      cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    },
    {
      headerName: 'Passed',
      field: 'Passed',
      width: 100,
      cellStyle: { 'font-weight': '600', 'font-size': '14px' },
    },
    {
        headerName: 'Action',
        cellRenderer: MyDailyESTCellComponent,
        cellRendererParams: {
          clicked: ({ from, data }) => {
            console.log(data);
          },
        },
        width: 220,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
  ];
}

cancelOtherRowEditors(currentRowIndex) {
  const renderers = this.gridApi.getCellRendererInstances();
  renderers.forEach(function (renderer) {
    if (
      !renderer._agAwareComponent?.isNew &&
      currentRowIndex !== renderer._params?.node.rowIndex
    ) {
      renderer._agAwareComponent?.onCancelClick();
    }
  });
}

onGridReady(params: any) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  // this.gridApi.setRowData();
  // this.gridColumnApi.autoSizeAllColumns();
}

onCellClicked(params: any) {
  if (params.node.field !== 'action') {
    this.cancelOtherRowEditors(params.node.rowIndex);
  }
}
ngOnInit(): void {
  // daily singlephase
  this.veeService.addDailyESTLoadData().subscribe((res: any) => {
    console.log(res, 'res');
    if (res || res.Data) {
      this.rowData =[ ...this.rowData, ...res.Data];
      this.Batches.Total = this.rowData?.length;
      console.log(this.rowData);
    }
  });

  //dropdown list data
  this.veeService.getEstimationList().subscribe((res1) => {
    console.log(res1);
    this.viewListData = this.checkData(res1);
    console.log(this.viewListData);
  });
}

checkData(data) {
  const finalData = {};
  data
    .filter((r) => {
      console.log(r.dataType);
      return r.dataType !== 'Billing';
    })
    .map((d) => {
      console.log(d);
      if (!finalData[d['dataType']]?.length) finalData[d['dataType']] = [];
      finalData[d['dataType']].push(d);
    });

  return finalData;
}
Batches = {
  Total: 0,
  Average: '0',
  ValidationQueue: '0',
  BatchQueue: '0',
};
// RUN & Go************************************************************************

Run(Event: any) {
  console.log(Event, this.viewListData?.DLP)
  const currentSellection = this.viewListData?.DLP?.find(       //viewListData(136LineNo)
    (r) => r.ruleName === Event
  );
  console.log(currentSellection,currentSellection?.meterType);
  if (currentSellection?.meterType !== 'Single phase') {
    let id = currentSellection?.estimationId;
    console.log(id)
    this.veeService.DailyESTMixAvgReport({vruleId : id}).subscribe((res) => {
      console.log(res);
      this.rowData = []
      // ***************************
      this.veeService.addDailyESTLoadData().subscribe((res: any) => {
        console.log(res, 'res');
        if (res || res.Data) {
          this.rowData = [...this.rowData,...res.Data];
          console.log(res.Data,this.rowData)
          this.Batches.Total = this.rowData?.length; 
        } 
         
        // ruleName.control.setValue('');
        // ruleName.control.markAsUntouched();
      });
      this.toster.success('Mixed DLP Average Rule work successfully');
});
}
else{
let id = currentSellection?.estimationId;
console.log(id)
this.veeService.DailyESTSPAvgReport({vruleId : id}).subscribe((res) => {
  console.log(res);
  this.rowData = []
  // ***************************
  this.veeService.addDailyESTLoadData().subscribe((res: any) => {
    console.log(res, 'res');
    if (res || res.Data) {
      this.rowData = [...this.rowData,...res.Data];
      console.log(res,this.rowData)
      this.Batches.Total = this.rowData?.length; 
    } 
     
    // ruleName.control.setValue('');
    // ruleName.control.markAsUntouched();
  });
  this.toster.success('Single Phase DLP Average Rule work successfully');
});
}
}
}


