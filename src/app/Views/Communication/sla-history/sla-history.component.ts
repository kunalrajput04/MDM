import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { MySLAHistoryCellComponent } from './SLA_History_Cell';

export interface IFilterData {
  fromdate: string;
  todate: string;
  meterNo: string;
 // dtName: string;
}
@Component({
  selector: 'app-sla-history',
  templateUrl: './sla-history.component.html',
  styleUrls: ['./sla-history.component.css'],
})
export class SLAHistoryComponent implements OnInit {
  //#region form

  formdata: IFilterData = {
    fromdate: '',
    todate: '',
    meterNo: '',
    
   // dtName: '',
  };
  //#end form region

  lables: any = [];
  dnData: any[] = [];
  // Table-Region
  public columnDefs: (ColDef | ColGroupDef)[];
  public editType: any;
  public gridColumnApi: any;
  public defaultColDef: ColDef;
  rowData: any[] = [];
  public rowClassRules: any;
  gridApi: any;
  frameworkComponents: any;
  selectedItems: any[] = [];
  originalRowData: any[] = [];
  constructor(
    private service: DataService,
    private datePipe: DatePipe,
    private authservice: AuthService
  ) {
    // Table
    this.defaultColDef = {
      resizable: true,
      editable: true,
      sortable: true,
      filter: true,
      sortingOrder: ['asc', 'desc'],
      suppressKeyboardEvent: function (event: any): any {
        if (!event.editing || event.event.code === 'Enter') return true;
      },
    };

    this.columnDefs = [
      {
        headerName: 'No',
        field: '',
        sortable: true,
        valueGetter: 'node.rowIndex + 1',
        width: 70,
        cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Owner',
        field: 'OwnerName',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Month',
        field: 'SlaMonth',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },

      {
        headerName: 'Active',
        field: 'Active',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },

      {
        headerName: 'Failure',
        field: 'Failure',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Faulty',
        field: 'Faulty',
        sortable: true,
        width: 90,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Inactive',
        field: 'Inactive',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Installed',
        field: 'Installed',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },

      {
        headerName: 'Never',
        field: 'Never',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Non',
        field: 'Non',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Success(%)',
        field: 'Percentage',
        sortable: true,
        width: 130,
        valueFormatter: (params) => {
          let val = params.value;
          return val != null ? parseFloat(val).toFixed(2) : ''; // Format to 2 decimal places
        },
      },

      {
        headerName: 'Success',
        field: 'Success',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      // {
      //   headerName: 'Log',
      //   cellRenderer: MySLAHistoryCellComponent,
      //   field: 'pdflink',
      //   width: 100,
      //   cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      // },
    ];

    this.editType = 'fullRow';
  
  }

  

  cancelOtherRowEditors(currentRowIndex: any) {
    const renderers = this.gridApi.getCellRendererInstances();
    renderers.forEach(function (renderer: any) {
      if (
        !renderer._agAwareComponent?.isNew &&
        currentRowIndex !== renderer._params?.node.rowIndex
      ) {
        renderer._agAwareComponent?.onCancelClick();
      }
    });
  }
  /** provide gridReady callback to the grid */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.rowData = [];
     // Set default dates
     const today = new Date();
     const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
     
     this.formdata.fromdate = this.datePipe.transform(lastMonth, 'yyyy-MM-dd');
     this.formdata.todate = this.datePipe.transform(today, 'yyyy-MM-dd');
 
     // Initial data load with default dates
     this.loadData();
    // this.service.slaDataOfHistory(slaData).subscribe((res: any) => {
    //   Object.values(res?.data[0] ?? '')?.map((data, k, arr: any) => {
    //     if (k !== 0) {
    //       const d = {};
    //       arr[0].map((k, key) => {
    //         d[k] = data[key];
    //       });
    //       this.rowData.push(d);
    //     }
    //   });
    //   this.gridApi.setRowData(this.rowData);
    // });
  }
  loadData() {
    const slaData = {
      level_name: 'ALL',
      level_value: 'MPDCL',
      start_date: this.formdata.fromdate || '2020-10-14',
      end_date: this.formdata.todate || '2030-12-31',
    };

    this.service.slaDataOfHistory(slaData).subscribe((res: any) => {
      this.originalRowData = [];
      Object.values(res?.data[0] ?? '')?.map((data, k, arr: any) => {
        if (k !== 0) {
          const d = {};
          arr[0].map((k, key) => {
            d[k] = data[key];
          });
          this.originalRowData.push(d);
        }
      });
      this.rowData = [...this.originalRowData];
      this.gridApi.setRowData(this.rowData);
    });
  }

  onCellClicked(params: any) {
    if (params.node.field !== 'action') {
      this.cancelOtherRowEditors(params.node.rowIndex);
    }
  }

  ngOnInit(): void {}

  onSubmit(form: any) {
    if (!this.formdata.fromdate || !this.formdata.todate) {
      alert('Please select both From and To dates');
      return;
    }

    const fromDate = new Date(this.formdata.fromdate);
    const toDate = new Date(this.formdata.todate);

    if (fromDate > toDate) {
      alert('From date cannot be greater than To date');
      return;
    }

    // Reload data with new date range
    this.loadData();
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'SLAHistorytData.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }
}
const slaData = {
  level_name: 'ALL',
  level_value: 'MPDCL',
  start_date: '2020-10-14',
  end_date: '2030-12-31',
};
