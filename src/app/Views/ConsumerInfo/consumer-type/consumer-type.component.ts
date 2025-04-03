import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { PrepaidPostpaid } from 'src/app/Model/prepaid-postpaid';
import { AuthService } from 'src/app/Service/auth.service';
import { InstantDemandService } from 'src/app/Service/instant-demand.service';
import { ButtonRendererComponent } from 'src/app/Shared/button-renderer/button-renderer.component';

@Component({
  selector: 'app-consumer-type',
  templateUrl: './consumer-type.component.html',
  styleUrls: ['./consumer-type.component.css'],
})
export class ConsumerTypeComponent implements OnInit {
  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'Consumer',
    levelurl: '',
    menuname: '',
    url: '/mdm/consumer/',
  };
  consumertype: string;

  //#endregion
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  gridApi: any;
  datalist: PrepaidPostpaid[] = [];
  frameworkComponents: any;
  constructor(
    private service: InstantDemandService,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private router: Router
  ) {
    this.authservice.chagneHeaderNav(this.data);
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.columnDefs = [
      {
        headerName: 'Action',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onBtnClick1.bind(this),
          label: 'View',
          color: 'blue',
        },
      },
      { field: 'customerName' },
      { field: 'customerNo' },
      { field: 'whatsappNo' },
      { field: 'meterSerialNumber' },
      { field: 'simImei' },
      { field: 'consumerType' },
      { field: 'iPv6Address' },
      { field: 'meterSealNo' },
      { field: 'boxSealNo' },
      { field: 'gprsSealNo' },
      { field: 'meterManufacture' },
    ];
  }
  onBtnClick1(e) {
    let deviceID = e.rowData.customerNo;
    this.router.navigate(['mdm/consumer/ConsumerDetails', deviceID]);
  }

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      if (this.data.menuname != '') {
        this.data.menuname = res.type;
        this.onList();
      } else this.data.menuname = res.type;
      this.getrole(res.type);
    });
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'FaultyMeters.csv',
      processCellCallback: function (cell) {
        if (cell.column.colId == 'simImei') return '\u200C' + cell.value;
        else return cell.value;
      },
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.service.getPrepaidPostpaid(this.data.menuname).subscribe(
      (res: any) => {
        if (res.success) {
          this.datalist = res.data;
          this.gridApi.setRowData(this.datalist);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      }
    );
  }

  onList() {
    this.datalist = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.service.getPrepaidPostpaid(this.data.menuname).subscribe(
      (res: any) => {
        if (res.success) {
          this.datalist = res.data;
          this.gridApi.setRowData(this.datalist);
          this.gridColumnApi.autoSizeAllColumns();
        }
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
      }
    );
  }

  getrole(data: any) {
    if (data == 'Prepaid') this.consumertype = 'Prepaid Consumer';
    else if (data == 'Postpaid') this.consumertype = 'Postpaid Consumer';
    else if (data == 'PostpaidSingle')
      this.consumertype = 'Postpaid Single Consumer';
    else if (data == 'PostpaidThree')
      this.consumertype = 'Postpaid Three Consumer';
    else if (data == 'PostpaidCT') this.consumertype = 'Postpaid CT Consumer';
    else if (data == 'PostpaidHT') this.consumertype = 'Postpaid HT Consumer';
    else if (data == 'PrepaidSingle')
      this.consumertype = 'Prepaid Single Consumer';
    else if (data == 'PrepaidThree')
      this.consumertype = 'Prepaid Three Consumer';
  }
}
