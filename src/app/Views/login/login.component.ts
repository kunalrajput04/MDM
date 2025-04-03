import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Login, User } from 'src/app/Model/login';
import { AuthService } from 'src/app/Service/auth.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SmartMeter } from 'src/app/Model/smart-meter';
import { environment } from 'src/environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  siteKey: string = '6LeV1W0eAAAAAOCbEJTuw7e__K8R1j1eEyNfN4YO';
  loginForm: FormGroup;
  version: string = environment.mdmVersion;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
    //this.toastr.success('Hey');
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      userName: ['', [Validators.required]],
      deviceType: 'Web',
      password: ['', [Validators.required, Validators.minLength(6)]],
      captchaToken: '',
    });
  }

  userlogin() {
    this.loginForm.value.captchaToken = this.captchaElem.getResponse();

    this.loginForm.value.deviceType = 'Web';
    this.authservice.login(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.authservice.doLoginUser(res.data.userName, res.data.token);
          //this.setApiToken();
          localStorage.setItem('Name', res.data.fullName);
          localStorage.setItem('AccessLevel', res.data.accessLevel);
          localStorage.setItem('AccessValue', res.data.accessValue);
          localStorage.setItem('HesUserID', res.data.hesUserID);
          localStorage.setItem('RoleType', res.data.roleType);
          localStorage.setItem('apikey', res.data.apiKey);
          this.router.navigate(['/']);
        } else {
          this.loginForm.reset();

          this.captchaElem.resetCaptcha();
          this.toastr.error(res.message);
        }
      },
      (err) => {
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
}
