import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './Modules/shared/shared.module';
import { errorInterceptorProviders } from './Utils/Helpers/Error.interceptor';
import { HeaderComponent } from './Templates/header/header.component';
import { FooterComponent } from './Templates/footer/footer.component';
import { authInterceptorProviders } from './Utils/Helpers/Auth.interceptor';
import { HomeComponent } from './Templates/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [errorInterceptorProviders , authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
