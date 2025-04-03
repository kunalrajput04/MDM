import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { estimationRule } from 'src/app/Model/createEstimation';
import { VeeService } from 'src/app/Service/vee.service';

@Component({
  selector: 'app-daily-passed-report',
  templateUrl: './daily-passed-report.component.html',
  styleUrls: ['./daily-passed-report.component.css']
})
export class DailyPassedReportComponent implements OnInit {
  
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
    private route: Router,
    private veesr: VeeService,
    private toster: ToastrService,
    private datePipe: DatePipe,
  ) { 
    console.log(route.getCurrentNavigation().extras?.state)
    let data = route.getCurrentNavigation().extras?.state;
    if(data){
    this.viewListData = route.getCurrentNavigation().extras?.state.with;
    console.log(this.viewListData)
    }
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      {
        headerName: 'Created On',
        field: 'createdDate',
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },    
      {
        headerName: 'Meter No',
        field: 'meterNo',
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Meter Type',
        field: 'meterType',
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Energy',
        field: 'energy',
        width: 120,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },  
      {
        headerName: 'Parameter',
        field: 'parameter',
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Period',
        field: 'period',
        width: 100,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Rule Name',
        field: 'ruleName',
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Logic',
        field: 'logic',
        width: 120,
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
  //   this.veesr.MonthlyESTPassedReport({}).subscribe((res) => {
  //     console.log(res)
  // });
  console.log(this.viewListData)
  if(this.viewListData){
  this.viewListData?.map((res)=> {res.energy = res?.energy.toFixed(2);
    // res.createdDate = res?.createdDate.slice(0, 10);
    res.createdDate = this.datePipe.transform(
      new Date(res?.createdDate),
      'yyyy-MM-dd'
    );  
console.log(res)
  return res});
  console.log(this.viewListData,"formatted")
  this.rowData = this.viewListData;
 
  }
  else{
    console.log("here")
    this.route.navigate(['/mdm/vee/DaliyEstimation']);
  }
  console.log(this.viewListData)
}

}
