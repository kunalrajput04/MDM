import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/Model/group';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { UserService } from 'src/app/Service/user.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'User',
    levelurl: '',
    menuname: 'Update User',
    url: '/mdm/user',
  };


  groupList: Group[] = [];
  formData: Group = {
    directorMobileNo: '',
    directorName: '',
    email: '',
    fullName: '',
    imageUrl: '',
    password: '',
    roleType: '',
    userAddress: '',
    userID: 0,
    userName: '',
    isAssets: true,
    isPrepaidService: true,
    isCustomer: true,
    isEnergy: true,
    isMeter: true,
    isRevenue: true,
    isUser: true,
    isWealth: true,
    isconsumer: true,
    isException: true,
    isPrepaid: true,
    isVee: true,
    isCommunication: true,
    accessLevel: 'All',
    subdivisonName: '',
    substationName: '',
    feederName: '',
    dtName: '',
    ownerName: '',
    createdDate: ''
  };
  imageUrl: string = environment.imageUrl;
  isManage: boolean = false;
  fileToUpload: File = null;
  imageUrll: string;
  defaultimage: string = '/assets/img/default-image.jpg';
  isEdit: boolean = false;
  userid: number;

  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];

  constructor(
    private service: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService,


  ) {
    this.authservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.userid = this.route.snapshot.params['id'];
    this.getDetails(this.userid);

  }

  getDetails(data: number) {

    this.service.getGroupbyId(data).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.formData = res.data;
          this.isEdit = true
        } else {
          this.toastr.error(res.message);
        }

      },
      (err) => {
        if (err.status == 400)
          this.toastr.error(err);
      }
    )

  }

  onEdit(data: Group) {
    this.isManage = true;
    this.isEdit = true;
    this.imageUrll = this.imageUrl + data.imageUrl;
    this.formData = data;
  }

  cancel() {
    this.cleanForm();
    this.isManage = false;
  }

  manageForm() {

    if (!this.imageUrll)
      this.formData.imageUrl = null;
    this.service.manageGroup(this.formData).subscribe(
      (res: any) => {
        if (res.success == true) {

          this.toastr.success(res.message)
          this.isManage = false;
          this.cleanForm();
        } else {
          this.toastr.error(res.message);
        }

      },
      (err) => {
        if (err.status == 400)
          this.toastr.error(err);
      }
    );

  }

  cleanForm() {
    this.formData = {
      directorMobileNo: '',
      directorName: '',
      email: '',
      fullName: '',
      imageUrl: '',
      password: '',
      roleType: '',
      userAddress: '',
      userID: 0,
      userName: '',
      isAssets: false,
      isPrepaidService: false,
      isCustomer: false,
      isEnergy: false,
      isMeter: false,
      isRevenue: false,
      isUser: false,
      isWealth: false,
      isconsumer: false,
      isException: false,
      isPrepaid: false,
      isVee: false,
      isCommunication: false,
      accessLevel: 'All',
      subdivisonName: '',
      substationName: '',
      feederName: '',
      dtName: '',
      ownerName: '',
      createdDate: ''
    };
  }

  handleFileInput(e: any) {
    const file = (e.target as HTMLInputElement).files[0];
    if (
      file.type == 'image/jpeg' ||
      file.type == 'image/png' ||
      file.type == 'image/jpg'
    ) {
      if (file.size / 1024 > 50) {
        e.target.value = null;
        Swal.fire({
          icon: 'error',
          text: 'Oops!! File size not more than 50 Kb',
        });
      } else {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageUrll = event.target.result;
          this.formData.imageUrl = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    } else {
      //this.toastr.error('File Format Not Supported');
      e.target.value = null;
      Swal.fire({
        icon: 'error',
        text: 'Oops!! Only .png, .jpg, jpeg file supported.',
      });
    }

    console.log('size', file.size / 1024);
    console.log('type', file.type);

    //Show image preview
  }

  changeStatus(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    console.log(isChecked)
  }







}
