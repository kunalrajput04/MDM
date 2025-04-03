import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Service/auth.service';
export interface IForgotPassword{
  emailAddress:string;
}
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
formData:IForgotPassword={
  emailAddress:''
}
  constructor(private authservice:AuthService,private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

  }

  onSubmit() {
    
    this.authservice.forgotPassword(this.formData.emailAddress).subscribe(
      (res: any) => {
        
        if (res.success) {
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err.message);
        else console.log(err);
      }
    );
  }

}
