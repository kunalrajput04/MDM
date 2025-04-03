import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { event, param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { validationRule } from 'src/app/Model/createValidation';
import { VeeService } from 'src/app/Service/vee.service';
import { MyCellComponent } from '../my-cell/my-cell.component';
@Component({
  selector: 'app-validation-rule',
  templateUrl: './validation-rule.component.html',
  styleUrls: ['./validation-rule.component.css'],
})
export class ValidationRuleComponent implements OnInit {
  formdata: validationRule = new validationRule();
  filterForm = {
    dataType: '',
    validationType: '',
    meterType: '',
  };
  data: any[] = [];
  searchdata: any[] = [];
  private gridApi;
  public gridColumnApi;
  public columnDefs: (ColDef | ColGroupDef)[];
  public rowData;
  public context;
  frameworkComponents: any;
  public editType;
  public defaultColDef;
  public rowClassRules;

  MeterType: any = ['Single phase', 'Three Phase', 'CT Meter', 'HT Meter'];
  typeData = {};

  public validationType = [
    { name: 'DLP', data: ['Descending', 'Max', 'KWH>KVAH'] },
    { name: 'Billing', data: ['Descending', 'Max','KWH>KVAH','PF', 'MD'] },
  ];

  constructor(
    private veesr: VeeService,
    private router: Router,
    private toster: ToastrService
  ) {
    // Call behavioursubject with vee-service******************************************
    // this.veesr.formData1.subscribe((res:any)=>{
    //   this.data=res;
    //   console.log(this.data);
    // })
    // **********************************************

    this.columnDefs = [
      {
        headerName: 'Rule Name',
        width: 140,
        field: 'validationRuleType',
        cellStyle: { 'font-size': '13px' },
      },
      {
        headerName: 'Meter Type',
        width: 140,
        editable: true,
        field: 'meterType',
        cellStyle: { 'font-size': '13px' },
      },
      {
        headerName: 'Data Type',
        width: 140,
        editable: true,
        field: 'dataType',
        cellStyle: { 'font-size': '13px' },
      },
      {
        headerName: 'validation Type',
        width: 185,
        editable: true,
        field: 'validationType',
        cellStyle: { 'font-size': '13px' },
      },
      {
        headerName: 'Parameter',
        width: 140,
        editable: true,
        field: 'parameter',
        cellStyle: { 'font-size': '13px' },
      },
      {
        headerName: 'Action_Edit',
        cellRenderer: MyCellComponent,
        cellRendererParams: {
          clicked: ({ from, data }) => {
            console.log(data);
            if (from == 'delete') {
              this.veesr.deleteRecord(data).subscribe((res) => {
                if (res)
                  this.toster.success('Validation rule deleted successfully');
                this.rowData = this.rowData.filter((x) => x.id !== data.id);
                console.log(this.rowData);
              });
            }
          },
        },
        width: 230,
      },
    ];

    this.editType = 'fullRow';

    console.log(this.data, 'data');
    this.frameworkComponents = {
      rowEditCRenderer: MyCellComponent,
    };

    this.rowClassRules = {
      'sick-days-warning': function (params) {
        var numSickDays = params.data.value1;
        return numSickDays % 2 == 0;
      },
      'sick-days-breach': 'data.value1 % 2',
    };

    this.defaultColDef = {
      resizable: true,
      editable: true,
      sortable: true,
      filter: true,
      sortingOrder: ['asc', 'desc'],
      stopEditingWhenGridLosesFocus: false,
      enableFilter: true,
      suppressKeyboardEvent: function (event: any): any {
        if (!event.editing || event.event.code === 'Enter') return true;
      },
    };
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
  }

  onCellClicked(params: any) {
    if (params.node.field !== 'action') {
      this.cancelOtherRowEditors(params.node.rowIndex);
    }
  }
  ngOnInit(): void {
    this.typeData = this.validationType.filter((x) => x.name == 'DLP')[0].data;
    // Call Get API for TableData********************************************************
    this.veesr.ViewListData().subscribe((res) => {
      console.log(res,"valirule");
      this.rowData = res;
      this.searchdata = this.rowData;
      console.log(this.rowData);
    });
  }

  onChange(deviceValue: any) {
    this.typeData = this.validationType?.filter(
      (x) => x.name == deviceValue.target.value
    )[0]?.data;
    if(deviceValue.target.value == '') 
    this.filterForm.validationType = ''
    console.log(this.filterForm)

  }
  searchData(event: Event) {
    this.rowData = this.searchdata
    Object.entries(this.filterForm).map(([key, value]) => {
      console.log(key, value)
      if(value)
      this.rowData = this.rowData.filter((data)=> data[key] === value);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
