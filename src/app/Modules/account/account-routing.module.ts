import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { UsersListComponent } from './users-list/users-list.component';
import { IsAuthGuard } from 'src/app/Utils/Guards/is-auth.guard';
import { IsAdminGuard } from 'src/app/Utils/Guards/is-admin.guard';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent , canActivate:[IsAuthGuard] },
  { path: 'users-list', component: UsersListComponent , canActivate : [IsAuthGuard , IsAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
