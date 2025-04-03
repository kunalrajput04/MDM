import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComplainComponent } from 'src/app/Views/ComplainManagement/add-complain/add-complain.component';
import { ComplainDetailsComponent } from 'src/app/Views/ComplainManagement/complain-details/complain-details.component';
import { ComplainListComponent } from 'src/app/Views/ComplainManagement/complain-list/complain-list.component';
import { UpdateComplainComponent } from 'src/app/Views/ComplainManagement/update-complain/update-complain.component';
import { AddCustomerSupportComponent } from 'src/app/Views/CustomerSupport/add-customer-support/add-customer-support.component';
import { CustomerSupportDetailsComponent } from 'src/app/Views/CustomerSupport/customer-support-details/customer-support-details.component';
import { CustomerSupportListComponent } from 'src/app/Views/CustomerSupport/customer-support-list/customer-support-list.component';
import { UpdateCustomerSupportComponent } from 'src/app/Views/CustomerSupport/update-customer-support/update-customer-support.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', component: CustomerSupportListComponent },
  { path: 'Add', pathMatch: 'full', component: AddCustomerSupportComponent },
  { path: 'edit/:id', pathMatch: 'full', component: UpdateCustomerSupportComponent },
  { path: 'details/:id', pathMatch: 'full', component: CustomerSupportDetailsComponent },
  { path: 'Complaints', pathMatch: 'full', component: ComplainListComponent },
  { path: 'newComplaints', pathMatch: 'full', component: AddComplainComponent },
  { path: 'editComplaints/:id', pathMatch: 'full', component: UpdateComplainComponent },
  { path: 'ComplaintsInfo/:id', pathMatch: 'full', component: ComplainDetailsComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
