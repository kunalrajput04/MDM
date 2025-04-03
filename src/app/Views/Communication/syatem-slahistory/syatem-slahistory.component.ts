import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthService } from 'src/app/Service/auth.service';

import { DataService } from 'src/app/Service/data.service';

import { ColDef, ColGroupDef } from 'ag-grid-community';
import { MySLACellComponent } from './SLA_CEll';

export interface IFilterData {
  fromdate: string;
  todate: string;
  meterNo: string;
  dtName: string;
}
@Component({
  selector: 'app-syatem-slahistory',
  templateUrl: './syatem-slahistory.component.html',
  styleUrls: ['./syatem-slahistory.component.css'],
})
export class SyatemSLAHistoryComponent implements OnInit {
  //#region form

  formdata: IFilterData = {
    fromdate: '',
    meterNo: '',
    todate: '',
    dtName: '',
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
        headerName: 'S No',
        field: '',
        sortable: true,
        valueGetter: "node.rowIndex + 1",
        width: 100,
        cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Quarter',
        field: 'Quarter',
        sortable: true,
        width: 200,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'No Of Hours',
        field: 'Hours',
        sortable: true,
        width: 150,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'S1',
        field: 'S1',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'S2',
        field: 'S2',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'S3',
        field: 'S3',
        sortable: true,
        width: 100,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: '% Of Hours  Availability',
        field: 'SLA',
        sortable: true,
        width: 200,
        // cellStyle: { 'text-align': 'center' },
      },
      {
        headerName: 'Log',
        cellRenderer: MySLACellComponent,
        field: 'pdflink',
        width: 100,
        cellStyle: { 'font-weight': '600', 'font-size': '14px' },
      },
    ];

    this.editType = 'fullRow';
    // this.rowData = this.Data;
    this.frameworkComponents = {
      downloadButtonRenderer:MySLACellComponent ,
    };
  }

  // Table functions
  /** Add event handlers */

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
  }
  onCellClicked(params: any) {
    if (params.node.field !== 'action') {
      this.cancelOtherRowEditors(params.node.rowIndex);
    }
  }

  ngOnInit(): void {
    this.service.slaHistory(slaData).subscribe((res:any)=>{
      console.log(res.data)
      this.rowData = [];
      Object.values(res?.data[0] ?? '')?.map((data, k, arr:any)=> {
        if(k!==0) {
          const d = {}
          arr[0].map((k, key)=> {
            d[k] = data[key]
          })
          this.rowData.push(d)
        }
      });
      console.log( this.rowData)

    })
  }

  onSubmit(a: any) {
    console.log('Hello');
  }
 
  Data = [
    {
      'S No': 1,
      'Quarterly Report Date': '1-July-2021 To 30-Sep-2021',
      'No Of Days': '92',
      'No Of Hours': '2208',
      S1: '0',
      S2: '0',
      S3: '0',
      '% Of Hours  Availability': '',
    },
    {
      'S No': '2',
      'Quarterly Report Date': '1-Oct-2021 To 31st-Dec-2021',
      'No Of Days': '92',
      'No Of Hours': '2208',
      S1: '0',
      S2: '19.87 (.90%)',
      S3: '19.82  (.90%)',
      '% Of Hours  Availability': '',
    },
    {
      'S No': '3',
      'Quarterly Report Date': '1-Jan-2022 To 31st-March-2022',
      'No Of Days': '90',
      'No Of Hours': '2160',
      S1: '0',
      S2: '18.28 (.85%)',
      S3: '',
      '% Of Hours  Availability': '',
    },
    {
      'S No': '4',
      'Quarterly Report Date': '1-Aprill-2022 To 30-June-2022',
      'No Of Days': '91',
      'No Of Hours': '2184',
      S1: '0',
      S2: '17.47 (.80%)',
      S3: '',
      '% Of Hours  Availability': '',
    },
    {
      'S No': '5',
      'Quarterly Report Date': '1-July-2022 To 30-Sep-2022',
      'No Of Days': '92',
      'No Of Hours': '2208',
      S1: '0',
      S2: '18.77 (.80%)',
      S3: '',
      '% Of Hours  Availability': '',
    },
    {
      'S No': '6',
      'Quarterly Report Date': '1-Oct-2022 To 30-Dec-2022',
      'No Of Days': '92',
      'No Of Hours': '2208',
      S1: '0',
      S2: '18.77 (.80%)',
      S3: '',
      '% Of Hours  Availability': '',
    },
    {
      'S No': '7',
      'Quarterly Report Date': '1-Jan-2023 To 31-March-2023',
      'No Of Days': '90',
      'No Of Hours': '2160',
      S1: '0',
      S2: '18.36 (.85%)',
      S3: '',
      '% Of Hours  Availability': '',
    },
  ];
}
const slaData = {
  level_name : 'ALL',
  level_value: 'MPDCL',
  start_date: '2022-10-14',
  end_date : '2023-12-28'
};
