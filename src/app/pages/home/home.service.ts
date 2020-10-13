import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _httpService: HttpClient) { }

  getSchedule() {
    return this._httpService.get('https://spreadsheets.google.com/feeds/list/1PtP1cUQlQKIGWtkPmPaCJsYR8DEpzxx-A0NPB81vFqA/od6/public/full?alt=json');
  }

}
