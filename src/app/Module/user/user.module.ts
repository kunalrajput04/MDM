import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserManagementListtComponent } from 'src/app/Views/UserManagement/user-management-listt/user-management-listt.component';
import { FormsModule } from '@angular/forms';
import { AddUserComponent } from 'src/app/Views/UserManagement/add-user/add-user.component';
import { UpdateUserComponent } from 'src/app/Views/UserManagement/update-user/update-user.component';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { UserListbyRoleComponent } from 'src/app/Views/UserManagement/user-listby-role/user-listby-role.component';
import { LoginLogsComponent } from 'src/app/Views/UserManagement/login-logs/login-logs.component';
import { AgGridModule } from 'ag-grid-angular';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ActivityLogsComponent } from '../../Views/UserManagement/activity-logs/activity-logs.component';
import { EmailSmsLogComponent } from '../../Views/UserManagement/email-sms-log/email-sms-log.component';

@NgModule({
  declarations: [
    UserManagementListtComponent,
    AddUserComponent,
    UpdateUserComponent,
    UserListbyRoleComponent,
    LoginLogsComponent,
    ActivityLogsComponent,
    EmailSmsLogComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    NgSelect2Module,
    NgSelectModule,
    DataTablesModule,
    AgGridModule.withComponents([]),
    TooltipModule,
  ],
})
export class UserModule {}
