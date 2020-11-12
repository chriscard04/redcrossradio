import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  constructor(private _httpService: HttpClient) { }

  getSchedule() {
    return this._httpService.get('https://cors-anywhere.herokuapp.com/https://podcast.zenomedia.com/api/public/podcasts/agxzfnplbm8tc3RhdHNyKwsSCkF1dGhFbnRpdHkYgICg3fazoAsMCxIHUG9kY2FzdBiAgOD43PWnCQyiAQdsaWJyYXJ5/rss', { responseType: 'text' });
  }

}
