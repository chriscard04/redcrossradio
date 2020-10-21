import { Component } from '@angular/core';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'radio-app';
  public settings: Settings;

  constructor(private _appSettings: AppSettings, public router: Router) {
    this.settings = this._appSettings.settings;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-RDQ3S8JS21',
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    }
    );
  }
}
