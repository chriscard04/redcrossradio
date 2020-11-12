import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private drawer: MatDrawer;
  private loader: boolean = false;

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  toggle(): void {
    if (this.drawer != undefined) {
      this.drawer.toggle();
    }
  }

  getLoader(): boolean {
    return this.loader;
  }

  setLoader(): void {
    this.loader = true;
  }

}



