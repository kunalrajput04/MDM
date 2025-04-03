import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-user-listby-role',
  templateUrl: './user-listby-role.component.html',
  styleUrls: ['./user-listby-role.component.css'],
})
export class UserListbyRoleComponent implements OnInit {
  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'User',
    levelurl: '',
    menuname: '',
    url: '/mdm/user/',
  };

  //#endregion

  groupList: Group[] = [];
  imageUrl: string = environment.imageUrl;
  defaultimage: string = '/assets/images/layout/g1.jpg';
  rolename: string;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  role: string;
  constructor(
    private service: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
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
      destroy: true,
      retrieve: true,

      buttons: [
        { extend: 'excel', title: 'Instant Data' },

        { extend: 'pdf', title: 'Instant Data' },
      ],
    };

    this.route.params.subscribe((res) => {
      this.getrole(res.role);
      this.onList(res.role);
      this.role = res.role;
      this.data.menuname=this.role;
    });
  }

  add() {
    this.router.navigateByUrl('/mdm/user/Add');
  }
  onList(data: any) {
    ;
    
    this.service.getGroupListbyrole(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.groupList = res.data;

          this.dtTrigger.next();
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  getrole(data: any) {
    if (data == 'DTD') this.rolename = 'Director Distribution';
    else if (data == 'CEP') this.rolename = 'Chief Engineer Project';
    else if (data == 'ACEP') this.rolename = 'Additional Chief Engineer';
    else if (data == 'SE') this.rolename = 'Superintending Engineer ';
    else if (data == 'EE') this.rolename = 'Executive Engineer';
    else if (data == 'AEE') this.rolename = 'Assistant Executive Engineer';
  }

  rerender(data: any): void {
    this.onList(data);
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
          this.rerender(this.role);
        });
      }
    });
  }
}
