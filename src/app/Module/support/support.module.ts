import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { CustomerSupportListComponent } from 'src/app/Views/CustomerSupport/customer-support-list/customer-support-list.component';
import { CustomerSupportDetailsComponent } from 'src/app/Views/CustomerSupport/customer-support-details/customer-support-details.component';
import { AddCustomerSupportComponent } from 'src/app/Views/CustomerSupport/add-customer-support/add-customer-support.component';
import { UpdateCustomerSupportComponent } from 'src/app/Views/CustomerSupport/update-customer-support/update-customer-support.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComplainListComponent } from 'src/app/Views/ComplainManagement/complain-list/complain-list.component';
import { ComplainDetailsComponent } from 'src/app/Views/ComplainManagement/complain-details/complain-details.component';
import { AddComplainComponent } from 'src/app/Views/ComplainManagement/add-complain/add-complain.component';
import { UpdateComplainComponent } from 'src/app/Views/ComplainManagement/update-complain/update-complain.component';

@NgModule({
  declarations: [
    CustomerSupportListComponent,
    CustomerSupportDetailsComponent,
    AddCustomerSupportComponent,
    UpdateCustomerSupportComponent,
    ComplainListComponent,
    ComplainDetailsComponent,
    AddComplainComponent,
    UpdateComplainComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    DataTablesModule,
    NgSelect2Module,
    NgSelectModule,
    FormsModule,
  ],
})
export class SupportModule {}
