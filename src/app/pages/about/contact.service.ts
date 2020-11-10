import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { strict } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  // This API only supports 250 mails. So, when the limit is reached the alias must be changed.
  private mailApi = 'https://mailthis.to/Intern6Gmail'

  constructor(private http: HttpClient) { }

  postMessage(input: any) {
    return this.http.post(this.mailApi, input, { responseType: 'text' })
      .pipe(
        map(
          (response) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  }

  getUserCountry(): Observable<any[]> {
    return this.http.get<any[]>("https://ipinfo.io?token=ba1cc84fe673c4")
      .pipe();
  }

  getCountries() {
    let data: Array<countryList> = [];
    data.push({ name: "Americas", "countries": [] });
    data.push({ name: "Asia", "countries": [] });
    data.push({ name: "Africa", "countries": [] });
    data.push({ name: "Europe", "countries": [] });
    data.push({ name: "Oceania", "countries": [] });

    this.http.get<any[]>("https://restcountries.eu/rest/v2/region/Americas")
      .pipe()
      .subscribe((item) => {
        item.forEach((country) => {
          data[0].countries.push(country.name);
        })
      });


    this.http.get<any[]>("https://restcountries.eu/rest/v2/region/Asia")
      .pipe()
      .subscribe((item) => {
        item.forEach((country) => {
          data[1].countries.push(country.name);
        })
      });

    this.http.get<any[]>("https://restcountries.eu/rest/v2/region/Africa")
      .pipe()
      .subscribe((item) => {
        item.forEach((country) => {
          data[2].countries.push(country.name);
        })
      });

    this.http.get<any[]>("https://restcountries.eu/rest/v2/region/Europe")
      .pipe()
      .subscribe((item) => {
        item.forEach((country) => {
          data[3].countries.push(country.name);
        })
      });

    this.http.get<any[]>("https://restcountries.eu/rest/v2/region/Oceania")
      .pipe()
      .subscribe((item) => {
        item.forEach((country) => {
          data[4].countries.push(country.name);
        })
      });
    return data;
  }
}

export interface countryList {
  name: string;
  countries: Array<string>;
}
