import {Injectable} from '@angular/core';
import {Settings} from './app.settings.model';

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'CruzRojaRadio',   //theme name
        true,       //loadingSpinner
        true,       //fixedHeader
        true,       //sidenavIsOpened
        true,       //sidenavIsPinned
        true,       //sidenavUserBlock
        'horizontal', //horizontal , vertical
        'default',  //default, compact, mini
        'pink-light',   //indigo-light, teal-light, red-light, blue-dark, green-dark, pink-dark
        false,       // true = rtl, false = ltr
        ""
    );
}

