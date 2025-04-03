import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Group, Member } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management-listt',
  templateUrl: './user-management-listt.component.html',
  styleUrls: ['./user-management-listt.component.css'],
})
export class UserManagementListtComponent implements OnInit {

  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'User',
    levelurl: '',
    menuname: 'Users',
    url: '/mdm/user/',
  };

  //#endregion

  groupList: Group[] = [];
  imageUrl: string = environment.imageUrl;
  defaultimage: string = '/assets/images/layout/g1.png';
  isManage: boolean = false;
  members: Member[] = [];
  loading: boolean = false;
  virtualScroll: boolean = true;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private service: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authservice: AuthService
  ) {
    this.authservice.chagneHeaderNav(this.data);
  }


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
      scrollY: 400,
      scrollX: true,
      dom: 'lBfrtip',
      processing: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };

    this.onList();
    this.getMembers();
  }

  add() {
    this.router.navigateByUrl('/mdm/user/Add');
  }

  getUsers(data: any) {
    let user = data.userID;
    this.groupList = this.groupList.filter((x) => x.userID == user);
  }

  getMembers() {
    this.loading = true;
    this.service.getMembers().subscribe(
      (res: any) => {
        this.members = res.data;
        this.loading = false;
      },
      (err) => { }
    );
  }

  onList() {
    this.service.getGroupList().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.groupList = res.data;
          this.dtTrigger.next();
          this.isManage = false;
        } else {
          this.toastr.error(res.message);
        }

      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  rerender(): void {
    this.onList();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  remove(data: any) {
    Swal.fire({
      title: 'Warning',
      text: 'Do you really want to delete this record?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.removeUser(data).subscribe((res: any) => {
          Swal.fire(res.message, '', 'success');
          this.rerender();
        });
      }
    });
  }
}
