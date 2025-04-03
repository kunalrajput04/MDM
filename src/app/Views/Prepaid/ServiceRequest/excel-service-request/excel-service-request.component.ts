import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/Model/group';
import { IServiceRequestAdd } from 'src/app/Model/iservice-request-add';
import { UserService } from 'src/app/Service/user.service';
import { ServiceRequestService } from 'src/app/Service/service-request.service';

@Component({
  selector: 'app-excel-service-request',
  templateUrl: './excel-service-request.component.html',
  styleUrls: ['./excel-service-request.component.css'],
})
export class ExcelServiceRequestComponent implements OnInit {
  members: Member[] = [];
  formData: IServiceRequestAdd = {
    requestID: 0,
    requestByName: localStorage.getItem('Name'),
    requestReason: '',
    requestType: '',
    response: '',
    remarks: '',
    requestTo: '',
    consumerNumber: '',
    requestStatus: 'Pending',
    accessLevel: localStorage.getItem('AccessLevel'),
    accessValue: localStorage.getItem('AccessValue'),
  };
  excelfile: any;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private userservice: UserService,
    private toastr: ToastrService,
    private service: ServiceRequestService
  ) {}

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.userservice.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
      },
      (err) => {}
    );
  }

  onChange(data: any) {
    let file = data.target.files;
    this.excelfile = file.item(0);
  }

  uploadFile() {
    this.service
      .ImportServiceRequestExcel(
        this.excelfile,
        this.formData.requestType,
        this.formData.requestTo
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.toastr.success(res.message);
            this.router.navigate(['/mdm/prepaid/servicerequest']);
          } else this.toastr.error(res.message);
        },
        (err) => {
          this.toastr.error(err.message);
        }
      );
  }
}
