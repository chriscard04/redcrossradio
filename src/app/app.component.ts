import { AfterViewInit, Component } from '@angular/core';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';
import { Gtag } from 'angular-gtag';
import { PagesService } from './pages/pages.service';

declare let gtag: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'radio-app';
  public settings: Settings;

  constructor(private _appSettings: AppSettings, public router: Router, public _pages: PagesService) {
    this.settings = this._appSettings.settings;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-3310F7ZJRS',
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    }
    );

  }
  ngAfterViewInit() {

  }
}
