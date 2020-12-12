import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/others/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/others/errors/error/error.component';

import { routing } from './app.routing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppSettings } from './app.settings';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GtagModule } from 'angular-gtag'

import { TuneInComponent } from './pages/tune-in/tune-in.component';
import { TitleService } from './app-title.service';

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    ErrorComponent,
    NotFoundComponent,
    TuneInComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    routing,
    GtagModule.forRoot({ trackingId: 'G-3310F7ZJRS', trackPageviews: false })
    
  ],
  providers: [
    AppSettings,
    TitleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
