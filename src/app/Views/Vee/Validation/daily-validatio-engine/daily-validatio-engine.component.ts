import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { VeeService } from 'src/app/Service/vee.service';
import { MyDailyCellComponent } from '../dailyCell/dailyCell';
import { MyDailyCellComponent2 } from '../dailyCell/dailyCell2';
import { validationRule } from 'src/app/Model/createValidation';
import { event } from 'jquery';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-daily-validatio-engine',
  templateUrl: './daily-validatio-engine.component.html',
  styleUrls: ['./daily-validatio-engine.component.css'],
})
export class DailyValidatioEngineComponent implements OnInit {
  currentTab: 'Que' | 'Comp' = 'Que';

  RuleData = {};
  // formdata: validation = {
  //   process: 'Daily Process',
  // };
  formdata: validationRule = new validationRule();
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
        cellRenderer: MyDailyCellComponent,
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
        headerName: 'Action',
        cellRenderer: MyDailyCellComponent2,
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
    // daily singlephase
    this.veeService
      .addDailyLoadData()
      // .pipe(
      //   map((res: any[]) =>
      //     res.map((data) => {
      //       const d = {};
      //       Object.entries(data).map(([key, value]) => {
      //         d[key?.toLowerCase()?.split(' ')?.join('')] = value;
      //       });
      //       return d;
      //     })
      //   )
      // )
      .subscribe((res: any) => {
        console.log(res, 'res');
        if (res || res.data) {
          this.rowData = [...this.rowData, ...res.data];
          this.Batches.Total = this.rowData?.length;
          console.log(this.rowData);
        }
      });
    // daily Mixed
    this.veeService.addDailyMixedLoadData()
    // .pipe(
    //   map((res: any[]) =>
    //     res.map((data) => {
    //       const d = {};
    //       Object.entries(data).map(([key, value]) => {
    //         d[key?.toLowerCase()?.split(' ')?.join('')] = value;
    //       });
    //       return d;
    //     })
    //   )
    // )
    .subscribe((res: any) => {
      console.log(res, 'res');
      if (res || res.data) {
        this.rowData = [...this.rowData, ...res.data];
        this.Batches.Total = this.rowData?.length;
      }
    });

    //dropdown list data
    this.veeService.ViewListData().subscribe((res1) => {
      // console.log(res1);
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

  // openDialog() {
  //   this.veeService.ViewListData().subscribe((res1) => {
  //     console.log(res1);
  //     this.viewListData = res1;
  //     const dialogRef = this.dialog.open(DialogRuleComponent, {
  //       data: this.viewListData,
  //     });
  //     dialogRef.afterOpened().subscribe((res) => {});
  //     // AFterClose***************************
  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log(result);
  //       this.veeService.addDailyLoadData().subscribe((res: any) => {
  //         this.rowData = res.Data;
  //         this.Batches.Total = this.rowData?.length;
  //         console.log(this.rowData);
  //       });
  //     });
  //   });
  // }

  // RUN & Go************************************************************************

  Run(Event: any, validationRule: any) {
    console.log(Event);
    const currentSellection = this.viewListData?.DLP?.find(
      (r) => r.validationRuleType === Event
    );
    console.log(currentSellection, currentSellection.meterType);
    if (currentSellection.meterType !== 'Single phase') {
      switch (currentSellection.validationType) {
        case 'Descending': {
          // DESC******************************
          let id = currentSellection.id;
          console.log(id);
          this.veeService
            .RunMixedDailyDlpDESC({ vruleid: id })
            .subscribe((res) => {
              console.log(res);
              this.rowData = [];
              // ***************************
              this.veeService.addDailyMixedLoadData().subscribe((res: any) => {
                console.log(res, 'res');
                if (res || res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  console.log(res.Data, 'descending', this.rowData);
                  this.Batches.Total = this.rowData?.length;
                }
                validationRule.control.setValue('');
                validationRule.control.markAsUntouched();
              });

              this.veeService.addDailyLoadData().subscribe((res: any) => {
                this.rowData = [...this.rowData, ...res.data];
                this.Batches.Total = this.rowData?.length;
                console.log(this.rowData);
              });

              this.toster.success('DLP Mixed Decending Rule work successfully');
            });
          break;
        }
        case 'Max': {
          // DESC******************************
          let id = currentSellection.id;
          console.log(id);
          this.veeService
            .RunMixedDailyDlpMAX({ vruleid: id })
            .subscribe((res) => {
              console.log(res);
              this.rowData = [];
              // ***************************
              this.veeService.addDailyMixedLoadData().subscribe((res: any) => {
                console.log(res, 'res');
                if (res || res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  console.log(res.Data, 'descending', this.rowData);
                  this.Batches.Total = this.rowData?.length;
                }

                validationRule.control.setValue('');
                validationRule.control.markAsUntouched();
              });

              this.veeService.addDailyLoadData().subscribe((res: any) => {
                this.rowData = [...this.rowData, ...res.data];
                this.Batches.Total = this.rowData?.length;
                console.log(this.rowData);
              });

              this.toster.success('DLP Mixed Max Rule work successfully');
            });
          break;
        }

        case 'KWH>KVAH': {
          // DESC******************************
          let id = currentSellection.id;
          console.log(id);
          this.veeService
            .RunMixedDailyDlpKVH({ vruleid: id })
            .subscribe((res) => {
              console.log(res);
              this.rowData = [];
              // ***************************
              this.veeService.addDailyMixedLoadData().subscribe((res: any) => {
                console.log(res, 'res');
                if (res || res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  console.log(res.Data, 'descending', this.rowData);
                  this.Batches.Total = this.rowData?.length;
                }

                validationRule.control.setValue('');
                validationRule.control.markAsUntouched();
              });

              this.veeService.addDailyLoadData().subscribe((res: any) => {
                this.rowData = [...this.rowData, ...res.data];
                this.Batches.Total = this.rowData?.length;
                console.log(this.rowData);
              });

              this.toster.success('DLP Mixed KVH Rule work successfully');
            });
          break;
        }
      } //Switch Off
    } //IF Case Off
    // console.log(Event)
    else {
      // console.log(this.viewMixedSingleData == 'Single phase');
      console.log(Event);
      switch (currentSellection.validationType) {
        case 'Descending': {
          let id = currentSellection.id;
          console.log(id);
          this.veeService
            .RunValidationRule({ vruleid: id })
            .subscribe((res) => {
              console.log(res);
              this.rowData = [];
              // ********************************
              this.veeService.addDailyLoadData().subscribe((res: any) => {
                console.log(res, 'res');
                if (res || res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  this.Batches.Total = this.rowData?.length;
                  console.log(this.rowData);
                }
                validationRule.control.setValue('');
                validationRule.control.markAsUntouched();
              });

              this.veeService.addDailyMixedLoadData().subscribe((res: any) => {
                if (res && res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  this.Batches.Total = this.rowData?.length;
                  console.log(this.rowData);
                }
              });

              this.toster.success(
                'DLP PostCompareData Decending Rule work successfully'
              );
            });
          break;
        }
        case 'Max': {
          let id = currentSellection.id;
          console.log(id);
          this.veeService
            .RunValidationRule2({ vruleid: id })
            .subscribe((res) => {
              console.log(res);
              this.rowData = [];
              // ********************************
              this.veeService.addDailyLoadData().subscribe((res: any) => {
                console.log(res, 'res');
                if (res || res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  this.Batches.Total = this.rowData?.length;
                  console.log(this.rowData);
                }
                validationRule.control.setValue('');
                validationRule.control.markAsUntouched();
              });

              this.veeService.addDailyMixedLoadData().subscribe((res: any) => {
                this.rowData = [...this.rowData, ...res.data];
                this.Batches.Total = this.rowData?.length;
                console.log(this.rowData);
              });
              this.toster.success('DLP MaxThrehold Rule work successfully');
            });
          break;
        }
        case 'KWH>KVAH': {
          let id = currentSellection.id;
          console.log(id);
          this.veeService
            .RunValidationRule3({ vruleid: id })
            .subscribe((res) => {
              console.log(res);
              this.rowData = [];
              // ********************************
              this.veeService.addDailyLoadData().subscribe((res: any) => {
                console.log(res, 'res');
                if (res || res.data) {
                  this.rowData = [...this.rowData, ...res.data];
                  this.Batches.Total = this.rowData?.length;
                  console.log(this.rowData);
                }
                validationRule.control.setValue('');
                validationRule.control.markAsUntouched();
              });

              this.veeService.addDailyMixedLoadData().subscribe((res: any) => {
                this.rowData = [...this.rowData, ...res.data];
                this.Batches.Total = this.rowData?.length;
                console.log(this.rowData);
              });
              this.toster.success('DLP CompareKWhKVH Rule work successfully');
            });
          break;
        }
        default: {
          this.toster.error('DLP Rule Type not found');
          break;
        }
      }
    }
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
  meterType: 'string',
};
// *******************************

const dummy = {
  id: 0,
  createdOn: '2023-03-07T10:53:04.712Z',
  ruleCode: 'string',
  total: 0,
  success: 0,
  fail: 0,
  status: 'string',
  meterType: 'string',
};

const meterDummy = {
  // meterType: 'HTMeter'|'CTMeter'|'ThreePhase',
  meterType: 'HTMeter',
};
