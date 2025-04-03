import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Support } from 'src/app/Model/support';
import { SupportService } from 'src/app/Service/support.service';

@Component({
  selector: 'app-update-customer-support',
  templateUrl: './update-customer-support.component.html',
  styleUrls: ['./update-customer-support.component.css'],
})
export class UpdateCustomerSupportComponent implements OnInit {
  formData: Support = {
    sId: 0,
    referenceId: '',
    description: '',
    heading: '',
    created: new Date(),
    isActive: true,
    consumerName: '',
    createdUserName: '',
    assignId: 0,
    type: '',
  };
  id: number = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private service: SupportService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getSupportInfo();
  }
  getSupportInfo() {
    
    this.service.getInfoById(this.id).subscribe(
      (res: any) => {
        this.formData = res.data;

        
      },
      (err) => {
        
        if (err.status == 400) this.toastr.error(err);
      }
    );
  }
}
