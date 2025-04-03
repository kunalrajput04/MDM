import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Service/auth.service';

export interface IChangePassword {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  formData: IChangePassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  constructor(private toastr: ToastrService,
    private spinner: NgxSpinnerService, private authservice: AuthService) {
  }

  ngOnInit(): void {
  }

  manageForm() {
    if (this.formData.confirmPassword !== this.formData.newPassword)
      this.toastr.error('Confirm Password Mismatch !!!')
    else {
      
      this.authservice.changePassword(this.formData).subscribe(
        (res: any) => {
          if (res.success == true) {
            this.toastr.success(res.message);
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
  }
  cleanForm() {
    this.formData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }
}
