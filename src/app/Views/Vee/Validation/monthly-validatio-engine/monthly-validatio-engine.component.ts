import { Component, OnInit } from '@angular/core';
import { validation } from 'src/app/Model/vee-rules';
import { DialogRuleComponent } from '../dialog-rule/dialog-rule.component';
import { VeeService } from 'src/app/Service/vee.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { MonthlyBillingRuleComponent } from '../daily-Billing-Dialog/monthly-billing-rule/monthly-billing-rule.component';
import { MyMonthlyCellComponent } from '../Monthly-Download-cell/monthlyCell';
import { MyMonthlyCellComponent2 } from '../Monthly-Download-cell/monthlyCell2';

@Component({
  selector: 'app-monthly-validatio-engine',
  templateUrl: './monthly-validatio-engine.component.html',
  styleUrls: ['./monthly-validatio-engine.component.css']
})
export class MonthlyValidatioEngineComponent implements OnInit {
  currentTab: 'Que' | 'Comp' = 'Que';

  formdata: validation = {
    process: 'Monthly Process',
  };
  dnData: any[] = [];
  viewListData: any;
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
    public dialog: MatDialog,
    private toster: ToastrService
  ) {
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      {
        headerName: 'BATCH NO',
        field: 'id',
        width: 120,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'CREATED ON',
        field: 'createdOn',
        width: 200,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Rule Name',
        field: 'ruleCode',
        width: 300,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'TOTAL',
        field: 'total',
        width: 100,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'SUCCESS',
        field: 'success',
        width: 120,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'FAIL',
        field: 'fail',
        width: 100,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'STATUS',
        field: 'status',
        width: 130,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Log',
        cellRenderer: MyMonthlyCellComponent,
        cellRendererParams: {
          clicked: ({ from, data }) => {
            console.log(data);
            this.dnData = [data];
            this.gridApi.setRowData(this.dnData);
            this.gridColumnApi.autoSizeAllColumns();
            var excelParams = {
              fileName: 'NewEvents.csv',
            };
            this.gridApi?.exportDataAsCsv();
            this.gridApi.setRowData(this.rowData);
            this.gridColumnApi.autoSizeAllColumns();
            console.log(this.dnData);
          },
        },
        field: '',
        width: 100,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
      {
        headerName: 'Actio',
        cellRenderer: MyMonthlyCellComponent2,
        cellRendererParams: {
          clicked: ({ from, data }) => {
            //console.log(data);
          },
        },
        field: '',
        width: 150,
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
    this.veeService.addMonthlyLoadData().subscribe((res: any) => {
      console.log(res);
      if (res || res.data) {
      this.rowData = [...this.rowData, ...res.data];
      this.Batches.Total = this.rowData?.length;
      console.log(this.rowData);
      }
    });
    
    this.veeService.addMonthlyMixedLoadData().subscribe((res: any) => {
      console.log(res);
      if (res || res.data) {
      this.rowData = [...this.rowData, ...res.data];
      this.Batches.Total = this.rowData?.length;
      console.log(this.rowData);
      }
    });
  }
  
  Batches = {
    Total: 0,
    Average: '0',
    ValidationQueue: '0',
    BatchQueue: '0',
  };

  openDialog() {
    this.veeService.ViewListData().subscribe((res1) => {
      console.log(res1);
      this.viewListData = res1;
      const dialogRef = this.dialog.open(MonthlyBillingRuleComponent, {
        data: this.viewListData,
      });
      dialogRef.afterOpened().subscribe((res) => {});
      // AFterClose***************************
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result)
       
        this.rowData= []
        if(result.type !==  "Single Phase"){
        // Mixed
        this.veeService.addMonthlyMixedLoadData().subscribe((res:any)=>{
          this.rowData = [...this.rowData ,...res.data];
          this.Batches.Total = this.rowData?.length;
          console.log(this.rowData);
          });
        }
          this.veeService.addMonthlyLoadData().subscribe((res: any) => {
            this.rowData = [...this.rowData ,...res.data];
            this.Batches.Total = this.rowData?.length;
            console.log(this.rowData);
          });
        });
        // SinglePhase
      });
  
  }

  Insert(Event: any) {
    this.veeService.inserData(insertedData).subscribe((res) => {
      console.log(res);
      this.toster.success('DailyLoadProcess created successfully');
    });
  }
}
const insertedData = {
  meterSno: 'string',
  dateTime: '2023-03-10T07:52:57.376Z',
  mdasDatetime: '2023-03-10T07:52:57.376Z',
  energyImportKwh: 0,
  energyImportKvah: 0,
  energyExportKwh: 0,
  energyExportKvah: 0,
  apI_DateTime: '2023-03-10T07:52:57.376Z',
  validationRule: 'string',
};
