import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityLogsComponent } from 'src/app/Views/UserManagement/activity-logs/activity-logs.component';
import { AddUserComponent } from 'src/app/Views/UserManagement/add-user/add-user.component';
import { EmailSmsLogComponent } from 'src/app/Views/UserManagement/email-sms-log/email-sms-log.component';
import { LoginLogsComponent } from 'src/app/Views/UserManagement/login-logs/login-logs.component';
import { UpdateUserComponent } from 'src/app/Views/UserManagement/update-user/update-user.component';
import { UserListbyRoleComponent } from 'src/app/Views/UserManagement/user-listby-role/user-listby-role.component';
import { UserManagementListtComponent } from 'src/app/Views/UserManagement/user-management-listt/user-management-listt.component';

const routes: Routes = [ 
  { path: '', pathMatch: 'full', component: UserManagementListtComponent },
  { path: 'Add', pathMatch: 'full', component: AddUserComponent },
  { path: 'Add/:role', pathMatch: 'full', component: AddUserComponent },
  { path: 'edit/:id', pathMatch: 'full', component: UpdateUserComponent },
  { path: 'role/:role', pathMatch: 'full', component: UserListbyRoleComponent },
  { path: 'loginlogs', pathMatch: 'full', component: LoginLogsComponent },
  { path: 'activitylogs', pathMatch: 'full', component: ActivityLogsComponent },
  { path: 'emailsms', pathMatch: 'full', component: EmailSmsLogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
