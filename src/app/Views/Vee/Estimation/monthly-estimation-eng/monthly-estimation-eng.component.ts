import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { event, param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { estimationRule } from 'src/app/Model/createEstimation';
import { validationRule } from 'src/app/Model/createValidation';
import { VeeService } from 'src/app/Service/vee.service';
import { MyMonthlyESTCellComponent } from './MEstCell.component';

@Component({
  selector: 'app-monthly-estimation-eng',
  templateUrl: './monthly-estimation-eng.component.html',
  styleUrls: ['./monthly-estimation-eng.component.css'],
})
export class MonthlyEstimationEngComponent implements OnInit {
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
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Created On',
        field: 'CreatedOn',
        width: 180,
        cellStyle: { 'font-weight': '600','font-size': '14px' },
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
        width: 200,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Total',
        field: 'Total',
        width: 100,
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
          cellRenderer: MyMonthlyESTCellComponent,
          cellRendererParams: {
            clicked: ({ from, data }) => {
              console.log(data);
              // if (from == 'fail') {
              //   this.veeService.MonthlyESTFailedReport({ReportId:data.id}).subscribe((res) => {
              //     if (res)
              //       this.toster.success('Validation rule failed Report');
              //   });
              // }
              // if (from == 'pass') {
              //   this.veeService.MonthlyESTPassedReport({ReportId:data.id}).subscribe((res) => {
              //     if (res)
              //       this.toster.success('Validation rule Passed Report');
              //   });
              // }
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
    this.veeService.addMonthlyESTLoadData().subscribe((res: any) => {
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
        return r.dataType == 'Billing';
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
    console.log(Event, this.viewListData?.Billing)
    const currentSellection = this.viewListData?.Billing?.find(       //viewListData(136LineNo)
      (r) => r.ruleName === Event
    );
    console.log(currentSellection,currentSellection?.meterType);
    if (currentSellection?.meterType !== 'Single phase') {
      let id = currentSellection?.estimationId;
      console.log(id)
      this.veeService.MonthlyESTMixAvgReport({vruleId : id}).subscribe((res) => {
        console.log(res);
        this.rowData = []
        // ***************************
        this.veeService.addMonthlyESTLoadData().subscribe((res: any) => {
          console.log(res, 'res');
          if (res || res.Data) {
            this.rowData = [...this.rowData,...res.Data];
            console.log(res.Data,this.rowData)
            this.Batches.Total = this.rowData?.length; 
          } 
           
          // ruleName.control.setValue('');
          // ruleName.control.markAsUntouched();
        });
        this.toster.success('Mixed Bill Average Rule work successfully');
});
}
else{
  let id = currentSellection?.estimationId;
  console.log(id)
  this.veeService.MonthlyESTSPAvgReport({vruleId : id}).subscribe((res) => {
    console.log(res);
    this.rowData = []
    // ***************************
    this.veeService.addMonthlyESTLoadData().subscribe((res: any) => {
      console.log(res, 'res');
      if (res || res.Data) {
        this.rowData = [...this.rowData,...res.Data];
        console.log(res,this.rowData)
        this.Batches.Total = this.rowData?.length; 
      } 
       
      // ruleName.control.setValue('');
      // ruleName.control.markAsUntouched();
    });
    this.toster.success('Single Phase Bill Average Rule work successfully');
});
}
}
  }

// *******************************


