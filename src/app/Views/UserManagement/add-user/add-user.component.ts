import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/Model/group';
import { DataService } from 'src/app/Service/data.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { UserService } from 'src/app/Service/user.service';
import { environment } from 'src/environments/environment';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubstationService } from 'src/app/Service/substation.service';
import Swal from 'sweetalert2';
import { icon } from 'leaflet';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  //#region  menu
  data: HeaderMenu = {
    firstlevel: 'User',
    levelurl: '',
    menuname: 'Add New',
    url: '/mdm/user',
  };

  //#endregion
  
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
    accessLevel: 'ALL',
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

  utilityDropdown: any[] = [];
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  constructor(
    private service: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataservice: DataService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private authservice: AuthService,
    private route: ActivatedRoute,
  ) {
    this.authservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.formData.roleType = this.route.snapshot.params['role'];
    this.getUtility();
  }

  manageForm() {
    
    if(this.formData.ownerName==null || this.formData.ownerName=='' || this.formData.ownerName==undefined)
    this.formData.ownerName=localStorage.getItem('HesUserID');
    this.service.manageGroup(this.formData).subscribe(
      (res: any) => {
        
        if (res.success == true) {
          this.toastr.success(res.message);
          this.isManage = false;
          this.cleanForm();
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }

  onEdit(data: Group) {
    this.isManage = true;
    this.isEdit = true;
    this.imageUrll = this.imageUrl + data.imageUrl;
    this.formData = data;
  }
  addNew() {
    this.cleanForm();
    this.isManage = true;
    this.isEdit = false;
  }
  cancel() {
    this.cleanForm();
    this.isManage = false;
  }
  onList() {
    
    this.service.getGroupList().subscribe(
      (res: any) => {
        if (res.success == true) {
          this.groupList = res.data;
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

  checkExistingUser(val) {
    this.service.CheckExistingUserByMail(val).subscribe((res: any) => {
      if (res.success == false) {
        this.formData.email = '';
        Swal.fire({
          icon: 'error',
          text: res.message,
        });
      }
    });
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

    //Show image preview
  }

  changeStatus(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    console.log(isChecked);
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
      accessLevel: 'ALL',
      subdivisonName: '',
      substationName: '',
      feederName: '',
      dtName: '',
      ownerName: '',
      createdDate: ''
    };
  }

  getUtility() {
    
    this.subdivisionservice.getUtility().subscribe((res: any) => {
      
      this.utilityDropdown = [];

      
        
        let obj = res.data[0];
        for (var item in obj) {
          this.utilityDropdown.push(obj[item][0]);
        }
     
    });
  }

  getSubdivision(ownerName: any) {
    

    this.subdivisionservice.getSubdivisions(ownerName).subscribe((res: any) => {
      
        
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
        
    
    });
  }

  getSubstation(subdivision: string) {
    
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        
        this.substatioDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
       
      });
  }

  getFeeder(substation: string) {
    
    this.feederservice
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        
        this.feederDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        
      });
  }
  getDT(feeder: string) {
    
    this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
      
      this.dtDropDown = [];
      
        
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
     
    });
  }
  
}
