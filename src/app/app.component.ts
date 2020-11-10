import { Component } from '@angular/core';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';
import { Gtag } from 'angular-gtag';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'radio-app';
  public settings: Settings;

  constructor(private _appSettings: AppSettings, public router: Router, gtag: Gtag) {
    this.settings = this._appSettings.settings;
  }
}
