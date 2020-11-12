import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// import { MenuService } from '../theme/components/menu/menu.service';
import { Settings } from '../app.settings.model';
import { AppSettings } from '../app.settings';
import { PagesService } from './pages.service'
import { MatDrawer } from '@angular/material/sidenav';
// import { AppService } from 'app/core/services/app.services';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  //  providers: [MenuService],
})
export class PagesComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild('tooltip') tooltip: any;
  public settings: Settings;
  public menus = ['vertical', 'horizontal'];
  public menuOption: string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption: string;
  public isStickyMenu: boolean = false;
  public lastScrollTop: number = 0;
  public showBackToTop: boolean = false;
  public toggleSearchBar: boolean = false;
  private defaultMenu: string; //declared for return default menu when window resized
  public scrolledContent: any;
  public ClientName: string;
  public UserName: string;
  public radio: any;

  constructor(
    private _appSettings: AppSettings,
    private _router: Router,
    private _drawer: PagesService
    // private _menuService: MenuService,
    // private _service: AppService
  ) {
    this.settings = this._appSettings.settings;
  }

  ngOnInit() {


    if (window.innerWidth <= 768) {
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;



    /*     const clientObservable = this._service.getClientName();
        clientObservable.subscribe((data: any) => {
          this.ClientName = data.ClientName;
          this.UserName = data.UserName;
        }); */

  }

  ngAfterViewInit() {
    this._drawer.setDrawer(this.drawer);

    setTimeout(() => {
      this.settings.loadingSpinner = false;
    }, 1500);

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.settings.sidenavIsPinned) {
          this.sidenav.close();
        }
        if (window.innerWidth <= 768) {
          this.sidenav.close();
        }
      }
    });

    // if (this.settings.menu === 'vertical') this._menuService.expandActiveSubMenu(this._menuService.getMenuItems());
  }

  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this._router.navigate(['/']);
  }

  public chooseMenuType() {
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  public onPsScrollY(event) {
    this.scrolledContent = event.target;
    this.scrolledContent.scrollTop > 300 ? (this.showBackToTop = true) : (this.showBackToTop = false);
    if (this.settings.menu == 'horizontal') {
      if (this.settings.fixedHeader) {
        var currentScrollTop = this.scrolledContent.scrollTop > 56 ? this.scrolledContent.scrollTop : 0;
        currentScrollTop > this.lastScrollTop ? (this.isStickyMenu = true) : (this.isStickyMenu = false);
        this.lastScrollTop = currentScrollTop;
      } else {
        this.scrolledContent.scrollTop > 56 ? (this.isStickyMenu = true) : (this.isStickyMenu = false);
      }
    }
  }

  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -this.scrolledContent.scrollTop / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (this.scrolledContent.scrollTop != 0) {
        this.scrolledContent.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      this.scrolledContent.scrollTop = 0;
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical';
    } else {
      this.defaultMenu == 'horizontal' ? (this.settings.menu = 'horizontal') : (this.settings.menu = 'vertical');
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public closeSubMenus() {
    let menu = document.querySelector('.sidenav-menu-outer');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  getClient(clientName: string) {
    this.ClientName = clientName;
  }
}
