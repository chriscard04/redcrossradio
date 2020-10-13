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


@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    ErrorComponent,
    NotFoundComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    routing
  ],
  providers: [
    AppSettings,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
