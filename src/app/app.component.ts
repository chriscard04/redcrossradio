import { Component } from '@angular/core';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'radio-app';
  public settings: Settings;

  constructor(private _appSettings: AppSettings) {
    this.settings = this._appSettings.settings;
  }
}
