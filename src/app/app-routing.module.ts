import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { HomeComponent } from './Templates/home/home.component';
import { IsAuthGuard } from './Utils/Guards/is-auth.guard';
import { IsNotAuthGuard } from './Utils/Guards/is-not-auth.guard';

const routes: Routes = [
  { path: 'canvas', component: CanvasComponent , canActivate : [IsAuthGuard] },
  { path: '', component: HomeComponent },
  { path: 'canvas/:id', component: CanvasComponent },
  { path: 'auth', loadChildren: () => import('./Modules/auth/auth.module').then(m => m.AuthModule) , canActivate:[IsNotAuthGuard] },
  { path: 'illus', loadChildren: () => import('./Modules/illustration/illustration.module').then(m => m.IllustrationModule) },
  { path: 'account', loadChildren: () => import('./Modules/account/account.module').then(m => m.AccountModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
