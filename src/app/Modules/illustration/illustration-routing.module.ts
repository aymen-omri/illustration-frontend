import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IllustrationsListComponent } from './illustrations-list/illustrations-list.component';
import { IllustrationDetailsComponent } from './illustration-details/illustration-details.component';

const routes: Routes = [
  { path: 'list', component: IllustrationsListComponent },
  { path: 'details/:id', component: IllustrationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IllustrationRoutingModule { }
