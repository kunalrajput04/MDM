import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { ButtonRendererComponent } from 'src/app/Shared/button-renderer/button-renderer.component';

import Swal from 'sweetalert2';
declare let $: any;
export interface IFirmwareData {
  firmWareFile: File,
  manufacturer: string,
  version: string,
  status: string,
  imageIdentifier: string

}
export interface IFilterData {
  meterNo: string;
  accessLevel: string;
  accessValue: string;
  subdivisonName: string;
  substationName: string;
  feederName: string;
  dtName: string;
}
@Component({
  selector: 'app-firmware-update',
  templateUrl: './firmware-update.component.html',
  styleUrls: ['./firmware-update.component.css']
})
export class FirmwareUpdateComponent implements OnInit {






  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  isSubdivision: boolean = false;
  isSubstation: boolean = false;
  isFeeder: boolean = false;
  isDT: boolean = false;

  isMeter: boolean = true;

  //#region  menu
  datas: HeaderMenu = {
    firstlevel: 'Demand Service',
    levelurl: '',
    menuname: 'Firmware Update',
    url: '/mdm/prepaid/',
  };


  formFiledata: IFirmwareData = {
    firmWareFile: null,
    manufacturer: '',
    status: '',
    version: '',
    imageIdentifier: ''
  };
  formdata: IFilterData = {
    accessLevel: 'All',
    meterNo: '',
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
    accessValue: ''
  };

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  
  frameworkComponents: any;
  rowSelection = 'multiple';
  dropDownValue: string = 'Today';
  weekdropvalue: string = '';
  weekdate: string = '';
  constructor(
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private datePipe: DatePipe,
    private storeservice: SmartMeterService,
    private toaster: ToastrService,
    private datasharedservice: DataSharedService,
    private authservice: AuthService,
    private spinner: NgxSpinnerService) {
    this.authservice.chagneHeaderNav(this.datas);
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
    this.columnDefs = [
      {
        field: 'fileName',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },

      { field: 'uploadDatetime' },
      { field: 'imageIdentifier' },
      { field: 'status' },
      { field: 'version' },

      { field: 'manufacturer' },
      {
        headerName: 'Delete',

        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onDeleteRow.bind(this),
          label: 'Delete',
          color: 'red  !important',
          isModal: false
        }
      },
      {
        headerName: 'Update',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditRow.bind(this),
          label: 'Edit',
          color: 'blue  !important',
          isModal: true
        }
      },



    ];
    this.datasharedservice.chagneHeaderNav(this.datas);
  }




  ngOnInit(): void {
    this.getSubdivision();
  }







  onBtnExport() {
    var excelParams = {
      fileName: 'FirmwareList.csv',
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.onList();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }


  onList() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.storeservice.getFirmwareList().subscribe((res: any) => {
      
        this.tableData = res.data;
        
        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();

      
    });
  }


  uploadFirmware() {

    this.storeservice.addFirmware(this.formFiledata.firmWareFile, this.formFiledata.status, this.formFiledata.version, this.formFiledata.manufacturer).subscribe((res: any) => {

     
        if (res.result != 'false') {
          this.toaster.success(res.message);
          this.onList();
        }
        else {
          this.toaster.error(res.message);
        }
     
    });
  }


  updateFirmware() {
    this.storeservice.updateFirmwareList(this.formFiledata).subscribe((res: any) => {
     
        if (res.result != 'false') {
          this.toaster.success(res.message);
          this.onList();
        }
        else {
          this.toaster.error(res.message);
        }
      

    });
  }

  checkFile(data: any) {

    this.formFiledata.firmWareFile = data.target.files[0];

  }

  onDeleteRow(data: any) {

    let dataList = [
      {
        owner: data.rowData.owner,
        fileName: data.rowData.fileName
      }
    ];
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data! Enter your reason',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {

      if (result.isConfirmed) {
        this.storeservice
          .deleteFirmwareList(dataList)
          .subscribe((res: any) => {
            

            Swal.fire('Deleted Successfully', '', 'success');
            
            this.onList();
          });
      }
    });
  }

  onEditRow(data: any) {

    this.formFiledata = data.rowData;
  }


  getSelectedRowData() {

    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node =>

      node.data.manufacturer
    );

    let selectedFileName = selectedNodes.map(node =>

      node.data.fileName
    );

    let isAnyDuplicate = this.hasDuplicates(selectedData);
    if (isAnyDuplicate)
      this.toaster.error('You can not select multiple files from same manufacturer');
    else if (selectedData.length <= 0)
      this.toaster.error('Please select atleast one file');
    else {
      const s = {};
      for (var i = 0; i < selectedData.length; ++i) {
        let value = selectedData[i];

        s[value] = selectedFileName[i];

      }



      this.accessLevelChange();
      this.storeservice.addConfigs(this.formdata.accessLevel, this.formdata.accessValue, s, true).subscribe((res: any) => {
       
          if (res.result != 'false') {
            this.toaster.success(res.message);
            this.onList();
          }
          else {
            this.toaster.error(res.message);
          }
        
      });


    }
  }
  hasDuplicates(array) {

    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
        return true;
      }
      valuesSoFar[value] = true;
    }
    return false;
  }

  getSubdivision() {
    

    this.subdivisionservice.getSubdivision().subscribe(
      (res: any) => {
        
       

          this.subdivisionDropDown = [];
          let obj = res.data[0];
          for (var item in obj) {
            this.subdivisionDropDown.push(obj[item][0]);
          }
          
       
      },
      (err) => {
        
        this.toaster.error('Oops! Something Went Wrong.');
      }
    );
  }
  getSubstation(subdivision: string) {
    
    this.substation.getSubstationBySubdivision(subdivision).subscribe(
      (res: any) => {
        
        
        this.substatioDropDown = [];
       

          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
      
      },
      (err) => {
        
        this.toaster.error('Oops! Something Went Wrong.');
      }
    );
  }
  getFeeder(substation: string) {
    
    this.feederservice.getFeederBySubstation(substation).subscribe(
      (res: any) => {
        
        
        this.feederDropDown = [];
       
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
       
      },
      (err) => {
        
        this.toaster.error('Oops! Something Went Wrong.');
      }
    );
  }
  getDT(feeder: string) {
    
    this.dtservice.getDTByFeeder(feeder).subscribe(
      (res: any) => {
        
        
        this.dtDropDown = [];
       

          let obj = res.data[0];
          for (var item in obj) {
            this.dtDropDown.push(obj[item][0]);
          }
       
      },
      (err) => {
        
        this.toaster.error('Oops! Something Went Wrong.');
      }
    );
  }
  accessLevelChange() {
    if (this.formdata.accessLevel == 'METER') {
      this.formdata.accessValue = this.formdata.meterNo;
    }
    else if (this.formdata.accessLevel == 'SUBDEVISION') {
      this.formdata.accessValue = this.formdata.subdivisonName;
    }
    else if (this.formdata.accessLevel == 'SUBSTATION') {
      this.formdata.accessValue = this.formdata.substationName;
    }
    else if (this.formdata.accessLevel == 'FEEDER') {
      this.formdata.accessValue = this.formdata.feederName;
    }
    else if (this.formdata.accessLevel == 'DT') {
      this.formdata.accessValue = this.formdata.dtName;
    }
    else if (this.formdata.accessLevel == 'All') {
      this.formdata.accessValue = localStorage.getItem('AccessValue');
    }

  }

}
