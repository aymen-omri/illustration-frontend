import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IllustrationRoutingModule } from './illustration-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IllustrationsListComponent } from './illustrations-list/illustrations-list.component';
import { TextPipe } from 'src/app/Utils/Pipes/text.pipe';
import { IllustrationDetailsComponent } from './illustration-details/illustration-details.component';


@NgModule({
  declarations: [
    IllustrationsListComponent,
    TextPipe,
    IllustrationDetailsComponent
  ],
  imports: [
    CommonModule,
    IllustrationRoutingModule,
    SharedModule
  ]
})
export class IllustrationModule { }
